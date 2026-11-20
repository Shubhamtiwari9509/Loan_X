# LoanX ML Inference Service

A dedicated Python FastAPI inference microservice that loads the pre-trained `creditwise_model.pkl` pipeline and executes loan eligibility predictions for the LoanX platform.

## Architecture

- **Framework**: FastAPI + Uvicorn
- **Estimator Pipeline**: Scikit-learn `Pipeline` (version `1.7.2`)
  - **Preprocessor**: `ColumnTransformer`
    - Numerical Imputer: `SimpleImputer(strategy='median')`
    - Categorical Imputer: `SimpleImputer(strategy='most_frequent')`
    - Categorical Encoder: `OneHotEncoder(drop='first', handle_unknown='ignore')`
  - **Classifier**: `XGBClassifier` (`objective='binary:logistic'`)
- **Verified Class Mapping**:
  - `class 1` -> **Approved**
  - `class 0` -> **Rejected**
- **Decision Threshold**: Model default (`pipeline.predict()`), corresponding to `predict_proba()[:, 1] >= 0.5`.

## Endpoints

- `GET /health`: Health check and model metadata status.
- `POST /predict`: Evaluates loan eligibility across the 18 input features.

## Setup & Running

```bash
# 1. Activate virtual environment
source venv/bin/activate

# 2. Run tests
pytest tests/ -v

# 3. Start service
uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```
