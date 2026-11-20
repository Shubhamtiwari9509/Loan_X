import logging
import warnings
from pathlib import Path
from typing import Any, Optional

import joblib
import pandas as pd
import xgboost as xgb

from app.config import MODEL_PATH, MODEL_VERSION
from app.schemas import LoanApplicationInput, PredictionResponse

logger = logging.getLogger("loanx.ml")

# Exact 18 feature names and order expected by creditwise_model.pkl
FEATURE_NAMES = [
    "Applicant_Income",
    "Coapplicant_Income",
    "Employment_Status",
    "Age",
    "Marital_Status",
    "Dependents",
    "Credit_Score",
    "Existing_Loans",
    "DTI_Ratio",
    "Savings",
    "Collateral_Value",
    "Loan_Amount",
    "Loan_Term",
    "Loan_Purpose",
    "Property_Area",
    "Education_Level",
    "Gender",
    "Employer_Category"
]

CLASS_MAPPING = {
    1: "Approved",
    0: "Rejected"
}

CATEGORICAL_FEATURES = [
    "Employment_Status",
    "Marital_Status",
    "Loan_Purpose",
    "Property_Area",
    "Education_Level",
    "Gender",
    "Employer_Category"
]


class ModelService:
    """Encapsulates loading and running inference on the creditwise ML pipeline."""

    def __init__(self, model_path: Optional[Path] = None):
        self.model_path = model_path or MODEL_PATH
        self.pipeline: Any = None
        self._categories: dict[str, list[str]] = {}

    def load(self) -> None:
        """Loads and verifies the saved pipeline artifact."""
        if not self.model_path.exists():
            raise FileNotFoundError(
                f"Model file not found at {self.model_path.resolve()}"
            )

        logger.info(f"Loading pipeline from {self.model_path.resolve()}...")

        with warnings.catch_warnings():
            warnings.simplefilter("ignore")
            self.pipeline = joblib.load(self.model_path)

        if not hasattr(self.pipeline, "predict"):
            raise ValueError("Loaded artifact does not expose a predict() method.")

        if hasattr(self.pipeline, "named_steps"):
            preprocessor = self.pipeline.named_steps.get("preprocessor")
            model = self.pipeline.named_steps.get("model")

            if preprocessor is None or model is None:
                raise ValueError(
                    "Expected pipeline steps 'preprocessor' and 'model' "
                    "not found in artifact."
                )

            try:
                cat_transformer = preprocessor.named_transformers_.get("cat")

                if cat_transformer and hasattr(cat_transformer, "named_steps"):
                    encoder = cat_transformer.named_steps.get("encoder")

                    if encoder and hasattr(encoder, "categories_"):
                        for col, cats in zip(
                            CATEGORICAL_FEATURES, encoder.categories_
                        ):
                            self._categories[col] = list(cats)

            except Exception as e:
                logger.warning(f"Could not extract categories metadata: {e}")

        logger.info("Pipeline loaded and validated successfully.")

    @property
    def is_loaded(self) -> bool:
        return self.pipeline is not None

    @property
    def categories(self) -> dict[str, list[str]]:
        return self._categories

    def _prepare_dataframe(self, input_data: LoanApplicationInput):
        """Creates a DataFrame with the exact original feature order."""
        data_dict = input_data.model_dump()
        df = pd.DataFrame([data_dict])[FEATURE_NAMES]
        return data_dict, df

    def predict(self, input_data: LoanApplicationInput) -> PredictionResponse:
        """
        Existing prediction logic.
        The /predict response structure remains unchanged.
        """
        if not self.is_loaded:
            raise RuntimeError("Model is not loaded. Call load() before predicting.")

        _, df = self._prepare_dataframe(input_data)

        raw_pred = self.pipeline.predict(df)[0]
        predicted_class = int(raw_pred)

        decision = CLASS_MAPPING.get(predicted_class, "Rejected")

        if hasattr(self.pipeline, "predict_proba"):
            probas = self.pipeline.predict_proba(df)[0]
            prob_rejected = float(probas[0])
            prob_approved = float(probas[1])
        else:
            prob_approved = 1.0 if predicted_class == 1 else 0.0
            prob_rejected = 0.0 if predicted_class == 1 else 1.0

        return PredictionResponse(
            predicted_class=predicted_class,
            decision=decision,
            approval_probability=round(prob_approved, 4),
            rejection_probability=round(prob_rejected, 4),
            model_version=MODEL_VERSION
        )

    def explain(self, input_data: LoanApplicationInput) -> dict[str, Any]:
        """
        Generates local TreeSHAP explanations using XGBoost's built-in
        pred_contribs functionality.

        Contributions are in raw margin/log-odds, NOT probability points.
        """

        if not self.is_loaded:
            raise RuntimeError("Model is not loaded. Call load() before explaining.")

        data_dict, df = self._prepare_dataframe(input_data)

        try:
            preprocessor = self.pipeline.named_steps["preprocessor"]
            model = self.pipeline.named_steps["model"]

            # Transform original 18 features into the model's 27 features.
            transformed = preprocessor.transform(df)

            transformed_names = preprocessor.get_feature_names_out().tolist()

            booster = model.get_booster()
            dmatrix = xgb.DMatrix(transformed)

            # TreeSHAP contributions: 27 feature contributions + 1 bias.
            shap_output = booster.predict(
                dmatrix,
                pred_contribs=True
            )

            contributions = shap_output[0]

            if len(contributions) != len(transformed_names) + 1:
                raise ValueError(
                    "Unexpected TreeSHAP output size. "
                    f"Expected {len(transformed_names) + 1}, "
                    f"received {len(contributions)}."
                )

            # Initialize all original 18 features.
            aggregated = {
                feature: 0.0 for feature in FEATURE_NAMES
            }

            # Aggregate encoded contributions into original features.
            for transformed_name, contribution in zip(
                transformed_names, contributions[:-1]
            ):
                contribution = float(contribution)

                if transformed_name.startswith("num__"):
                    original_feature = transformed_name[len("num__"):]

                    if original_feature in aggregated:
                        aggregated[original_feature] += contribution

                elif transformed_name.startswith("cat__"):
                    encoded_name = transformed_name[len("cat__"):]

                    for original_feature in CATEGORICAL_FEATURES:
                        if encoded_name.startswith(original_feature + "_"):
                            aggregated[original_feature] += contribution
                            break

            # Build feature explanation records.
            feature_contributions = []

            for feature in FEATURE_NAMES:
                value = float(aggregated[feature])

                if value > 0:
                    direction = "approval"
                elif value < 0:
                    direction = "rejection"
                else:
                    direction = "neutral"

                feature_contributions.append({
                    "feature": feature,
                    "value": data_dict[feature],
                    "contribution": round(value, 6),
                    "direction": direction
                })

            # Sort by absolute contribution to identify strongest factors.
            ranked_features = sorted(
                feature_contributions,
                key=lambda item: abs(item["contribution"]),
                reverse=True
            )

            base_value = float(contributions[-1])

            output_margin = float(
                booster.predict(dmatrix, output_margin=True)[0]
            )

            contribution_sum = base_value + sum(
                item["contribution"] for item in feature_contributions
            )

            logger.info(
                "TreeSHAP explanation generated successfully. "
                "Features: %s",
                len(feature_contributions)
            )

            return {
                "model_version": MODEL_VERSION,
                "explanation_type": "XGBoost TreeSHAP",
                "output_scale": "raw_margin_log_odds",
                "base_value": round(base_value, 6),
                "output_margin": round(output_margin, 6),
                "contribution_sum": round(contribution_sum, 6),
                "contributions": feature_contributions,
                "top_factors": ranked_features[:5],
                "disclaimer": (
                    "Feature contributions represent model impact in "
                    "raw margin/log-odds, not changes in approval "
                    "probability or percentage points. Positive values "
                    "push the model toward approval; negative values "
                    "push it toward rejection."
                )
            }

        except Exception as e:
            logger.error(
                "Failed to generate TreeSHAP explanation: %s",
                e,
                exc_info=True
            )
            raise


# Global singleton instance
model_service = ModelService()
