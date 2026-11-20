import pytest
from app.model import ModelService, FEATURE_NAMES, CLASS_MAPPING
from app.schemas import LoanApplicationInput


@pytest.fixture(scope="module")
def loaded_service():
    service = ModelService()
    service.load()
    return service


def test_model_loading(loaded_service):
    assert loaded_service.is_loaded is True
    assert hasattr(loaded_service.pipeline, "predict")
    assert "preprocessor" in loaded_service.pipeline.named_steps
    assert "model" in loaded_service.pipeline.named_steps
    assert len(loaded_service.categories) == 7


def test_strong_profile_approved(loaded_service):
    payload = LoanApplicationInput(
        Applicant_Income=25000.0,
        Coapplicant_Income=10000.0,
        Employment_Status="Salaried",
        Age=38.0,
        Marital_Status="Married",
        Dependents=1.0,
        Credit_Score=780.0,
        Existing_Loans=0.0,
        DTI_Ratio=0.20,
        Savings=20000.0,
        Collateral_Value=50000.0,
        Loan_Amount=15000.0,
        Loan_Term=36.0,
        Loan_Purpose="Home",
        Property_Area="Urban",
        Education_Level="Graduate",
        Gender="Male",
        Employer_Category="MNC"
    )
    result = loaded_service.predict(payload)

    assert result.predicted_class == 1
    assert result.decision == "Approved"
    assert result.approval_probability > 0.85
    assert result.rejection_probability < 0.15
    assert round(result.approval_probability + result.rejection_probability, 2) == 1.0


def test_weak_profile_rejected(loaded_service):
    payload = LoanApplicationInput(
        Applicant_Income=1500.0,
        Coapplicant_Income=0.0,
        Employment_Status="Unemployed",
        Age=22.0,
        Marital_Status="Single",
        Dependents=4.0,
        Credit_Score=350.0,
        Existing_Loans=5.0,
        DTI_Ratio=0.85,
        Savings=200.0,
        Collateral_Value=0.0,
        Loan_Amount=40000.0,
        Loan_Term=60.0,
        Loan_Purpose="Personal",
        Property_Area="Rural",
        Education_Level="Not Graduate",
        Gender="Male",
        Employer_Category="Unemployed"
    )
    result = loaded_service.predict(payload)

    assert result.predicted_class == 0
    assert result.decision == "Rejected"
    assert result.approval_probability < 0.15
    assert result.rejection_probability > 0.85


def test_dti_ratio_percentage_auto_normalization(loaded_service):
    payload = LoanApplicationInput(
        Applicant_Income=15000.0,
        Coapplicant_Income=5000.0,
        Employment_Status="Salaried",
        Age=35.0,
        Marital_Status="Married",
        Dependents=1.0,
        Credit_Score=720.0,
        Existing_Loans=1.0,
        DTI_Ratio=34.0,  # 34% passed as percentage
        Savings=10000.0,
        Collateral_Value=25000.0,
        Loan_Amount=20000.0,
        Loan_Term=48.0,
        Loan_Purpose="Home",
        Property_Area="Urban",
        Education_Level="Graduate",
        Gender="Female",
        Employer_Category="Private"
    )
    # Check that DTI_Ratio was normalized to 0.34
    assert payload.DTI_Ratio == 0.34
    result = loaded_service.predict(payload)
    assert result.decision in ("Approved", "Rejected")
