# LoanX — AI-Powered Loan Eligibility & Prediction Platform

LoanX is a production-minded web application that combines a MERN stack backend/frontend with a dedicated Python machine learning inference service executing the pre-trained `creditwise_model.pkl` pipeline.

---

## Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │             React Frontend             │
                      │         (Vite + Tailwind CSS)          │
                      │         http://localhost:5173          │
                      └───────────────────┬────────────────────┘
                                          │  REST API / JWT
                                          ▼
                      ┌────────────────────────────────────────┐
                      │          Node.js Express API           │
                      │          http://127.0.0.1:5001         │
                      └─────────┬────────────────────┬─────────┘
                                │                    │
             Mongoose / BSON    │                    │  Internal HTTP
                                ▼                    ▼
                      ┌──────────────────┐  ┌──────────────────┐
                      │  MongoDB Atlas   │  │ Python ML Engine │
                      │  (Hosted Cloud)  │  │ (FastAPI/XGBoost)│
                      │                  │  │ Port 8001        │
                      └──────────────────┘  └──────────────────┘
```

---

## Services & Tech Stack

### 1. Machine Learning Service (`ml-service/`)
- **Runtime**: Python 3.12, FastAPI, Uvicorn, Scikit-learn (`1.7.2`), XGBoost (`3.4.1`), Pandas, Joblib.
- **Artifact**: `models/creditwise_model.pkl` (ColumnTransformer + XGBClassifier).
- **Verified Mapping**: Class `1` = **Approved**, Class `0` = **Rejected**.
- **Port**: `8001`

### 2. Backend API (`backend/`)
- **Runtime**: Node.js v24+ (ES Modules), Express.js, Mongoose, JWT, Bcrypt (12 rounds), Zod.
- **Database**: MongoDB Atlas (configurable via `MONGO_URI` in `.env`).
- **Security**: Helmet, CORS, Rate Limiting, RBAC (`user` vs `admin`).
- **Port**: `5001`

### 3. Frontend Web App (`frontend/`)
- **Runtime**: Vite, React 18, React Router v6, Tailwind CSS, Lucide React.
- **Theme**: Financial banking style, white surfaces, brand orange accent (`#FF6B00`), charcoal typography.
- **Port**: `5173`

---

## Quick Start Guide

### Step 1: Start the Python ML Service
```bash
cd ml-service
source venv/bin/activate
uvicorn app.main:app --host 127.0.0.1 --port 8001
```

### Step 2: Configure & Start the Node.js Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string and secrets:
# MONGO_URI="mongodb+srv://<user>:<password>@cluster0.mongodb.net/loanx?retryWrites=true&w=majority"

# Optional: Seed the initial administrator account
npm run seed:admin

# Start the server
npm run dev
```

### Step 3: Start the React Frontend
```bash
cd frontend
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## Running Automated Tests

### ML Service Tests (8 Tests)
```bash
cd ml-service
./venv/bin/pytest tests/ -v
```

### Backend API Tests (20 Tests)
```bash
cd backend
npm test
```

### Frontend Build Verification
```bash
cd frontend
npm run build
```
