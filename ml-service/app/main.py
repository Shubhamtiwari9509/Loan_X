import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.config import API_TITLE, API_VERSION, MODEL_VERSION
from app.model import FEATURE_NAMES, model_service
from app.schemas import (
    HealthResponse,
    LoanApplicationInput,
    PredictionResponse,
    ExplanationResponse
)


logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)

logger = logging.getLogger("loanx.api")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Loads the ML pipeline during service startup."""
    try:
        model_service.load()
        logger.info("LoanX ML Model successfully initialized at startup.")

    except Exception as e:
        logger.error(
            "Failed to initialize ML model: %s",
            e,
            exc_info=True
        )

    yield

    logger.info("Shutting down LoanX ML service.")


app = FastAPI(
    title=API_TITLE,
    version=API_VERSION,
    description=(
        "Internal Machine Learning inference service "
        "for the LoanX platform."
    ),
    lifespan=lifespan
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get(
    "/health",
    response_model=HealthResponse,
    tags=["Monitoring"]
)
def health_check():
    """Returns service health status and model availability."""

    if not model_service.is_loaded:
        return HealthResponse(
            status="unhealthy",
            model_loaded=False,
            model_version=MODEL_VERSION,
            feature_count=len(FEATURE_NAMES),
            categories={}
        )

    return HealthResponse(
        status="healthy",
        model_loaded=True,
        model_version=MODEL_VERSION,
        feature_count=len(FEATURE_NAMES),
        categories=model_service.categories
    )


@app.post(
    "/predict",
    response_model=PredictionResponse,
    status_code=status.HTTP_200_OK,
    tags=["Inference"]
)
def predict_loan_eligibility(
    payload: LoanApplicationInput
):
    """
    Evaluates loan eligibility using the existing
    Scikit-learn and XGBoost pipeline.
    """

    if not model_service.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "ML inference pipeline is not loaded "
                "or unavailable."
            )
        )

    try:
        result = model_service.predict(payload)
        return result

    except Exception as e:
        logger.error(
            "Inference error: %s",
            e,
            exc_info=True
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference calculation failed: {str(e)}"
        )


@app.post(
    "/explain",
    response_model=ExplanationResponse,
    status_code=status.HTTP_200_OK,
    tags=["Explainable AI"]
)
def explain_loan_prediction(
    payload: LoanApplicationInput
):
    """
    Generates feature-level TreeSHAP explanations
    for a loan prediction.

    Contributions are expressed in raw margin/log-odds,
    not probability percentage points.
    """

    if not model_service.is_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                "ML inference pipeline is not loaded "
                "or unavailable."
            )
        )

    try:
        result = model_service.explain(payload)
        return result

    except Exception as e:
        logger.error(
            "Explanation error: %s",
            e,
            exc_info=True
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to generate prediction explanation."
        )
