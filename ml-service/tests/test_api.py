import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["model_loaded"] is True
    assert data["feature_count"] == 18
    assert "Employment_Status" in data["categories"]


def test_predict_endpoint_valid(client):
    payload = {
        "Applicant_Income": 22000.0,
        "Coapplicant_Income": 8000.0,
        "Employment_Status": "Salaried",
        "Age": 32.0,
        "Marital_Status": "Married",
        "Dependents": 0.0,
        "Credit_Score": 770.0,
        "Existing_Loans": 1.0,
        "DTI_Ratio": 0.22,
        "Savings": 18000.0,
        "Collateral_Value": 35000.0,
        "Loan_Amount": 20000.0,
        "Loan_Term": 36.0,
        "Loan_Purpose": "Car",
        "Property_Area": "Semiurban",
        "Education_Level": "Graduate",
        "Gender": "Female",
        "Employer_Category": "Government"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_class" in data
    assert data["decision"] in ("Approved", "Rejected")
    assert 0.0 <= data["approval_probability"] <= 1.0
    assert 0.0 <= data["rejection_probability"] <= 1.0
    assert "disclaimer" in data


def test_predict_invalid_categorical_rejected_by_schema(client):
    payload = {
        "Applicant_Income": 20000.0,
        "Coapplicant_Income": 0.0,
        "Employment_Status": "INVALID_EMPLOYMENT",  # Invalid category
        "Age": 30.0,
        "Marital_Status": "Single",
        "Dependents": 0.0,
        "Credit_Score": 700.0,
        "Existing_Loans": 0.0,
        "DTI_Ratio": 0.30,
        "Savings": 5000.0,
        "Collateral_Value": 10000.0,
        "Loan_Amount": 15000.0,
        "Loan_Term": 36.0,
        "Loan_Purpose": "Personal",
        "Property_Area": "Urban",
        "Education_Level": "Graduate",
        "Gender": "Male",
        "Employer_Category": "Private"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422


def test_predict_missing_required_field(client):
    payload = {
        "Applicant_Income": 20000.0,
        # Missing Coapplicant_Income is fine (default 0.0), but let's omit Credit_Score
        "Employment_Status": "Salaried",
        "Age": 30.0,
        "Marital_Status": "Single",
        "Dependents": 0.0,
        # "Credit_Score": missing!
        "Existing_Loans": 0.0,
        "DTI_Ratio": 0.30,
        "Savings": 5000.0,
        "Collateral_Value": 10000.0,
        "Loan_Amount": 15000.0,
        "Loan_Term": 36.0,
        "Loan_Purpose": "Personal",
        "Property_Area": "Urban",
        "Education_Level": "Graduate",
        "Gender": "Male",
        "Employer_Category": "Private"
    }
    response = client.post("/predict", json=payload)
    assert response.status_code == 422
