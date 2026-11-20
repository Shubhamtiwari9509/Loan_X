
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Banknote,
  Briefcase,
  ChevronRight,
  ExternalLink,
  Info,
  ShieldAlert,
  Sparkles,
  User,
} from "lucide-react";
import { predictionApi } from "../api/client.js";
import { Alert } from "../components/common/Alert.jsx";
import { InputField } from "../components/forms/InputField.jsx";
import { SelectField } from "../components/forms/SelectField.jsx";

export function NewPrediction() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);

  const [formData, setFormData] = useState({
    Age: "",
    Gender: "",
    Marital_Status: "",
    Education_Level: "",
    Dependents: "",
    Employment_Status: "",
    Employer_Category: "",
    Applicant_Income: "",
    Coapplicant_Income: "",
    Savings: "",
    Credit_Score: "",
    Existing_Loans: "",
    DTI_Ratio: "",
    Loan_Amount: "",
    Loan_Term: "",
    Loan_Purpose: "",
    Property_Area: "",
    Collateral_Value: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});

  const completedFields = Object.values(formData).filter(
    (value) => value !== "" && value !== null && value !== undefined
  ).length;

  const progress = Math.round((completedFields / 18) * 100);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    const parsedValue =
      type === "number"
        ? value === ""
          ? ""
          : Number(value)
        : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    Object.entries(formData).forEach(([field, value]) => {
      if (value === "" || value === null || value === undefined) {
        errors[field] = "This field is required.";
      }
    });

    if (formData.Age !== "" && (formData.Age < 18 || formData.Age > 100)) {
      errors.Age = "Age must be between 18 and 100 years.";
    }

    if (
      formData.Dependents !== "" &&
      (formData.Dependents < 0 || formData.Dependents > 20)
    ) {
      errors.Dependents = "Dependents must be between 0 and 20.";
    }

    if (
      formData.Applicant_Income !== "" &&
      formData.Applicant_Income <= 0
    ) {
      errors.Applicant_Income =
        "Applicant income must be greater than zero.";
    }

    if (
      formData.Coapplicant_Income !== "" &&
      formData.Coapplicant_Income < 0
    ) {
      errors.Coapplicant_Income = "Income cannot be negative.";
    }

    if (formData.Savings !== "" && formData.Savings < 0) {
      errors.Savings = "Savings cannot be negative.";
    }

    if (
      formData.Credit_Score !== "" &&
      (formData.Credit_Score < 300 || formData.Credit_Score > 900)
    ) {
      errors.Credit_Score =
        "Credit score must be between 300 and 900.";
    }

    if (
      formData.Existing_Loans !== "" &&
      (formData.Existing_Loans < 0 || formData.Existing_Loans > 50)
    ) {
      errors.Existing_Loans =
        "Existing loans must be between 0 and 50.";
    }

    if (
      formData.DTI_Ratio !== "" &&
      (formData.DTI_Ratio < 0 || formData.DTI_Ratio > 100)
    ) {
      errors.DTI_Ratio =
        "DTI ratio must be between 0% and 100%.";
    }

    if (
      formData.Loan_Amount !== "" &&
      formData.Loan_Amount < 1000
    ) {
      errors.Loan_Amount =
        "Loan amount must be at least 1000.";
    }

    if (
      formData.Loan_Term !== "" &&
      (formData.Loan_Term < 6 || formData.Loan_Term > 360)
    ) {
      errors.Loan_Term =
        "Loan term must be between 6 and 360 months.";
    }

    if (
      formData.Collateral_Value !== "" &&
      formData.Collateral_Value < 0
    ) {
      errors.Collateral_Value =
        "Collateral value cannot be negative.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const res = await predictionApi.create(formData);

      if (res.success && res.prediction) {
        navigate(`/prediction-result/${res.prediction._id}`, {
          state: { prediction: res.prediction },
        });
      }
    } catch (err) {
      setServerError(
        err.message ||
          "Failed to process loan evaluation. Please verify all fields."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-7 sm:py-9 space-y-7">

      {/* Page Header */}
      <div className="relative overflow-hidden rounded-3xl bg-navy-900 p-6 sm:p-8 lg:p-9 shadow-lg">
        <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-brand-primary/15 blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-24 w-56 h-56 rounded-full bg-blue-400/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
          <div className="max-w-2xl">


            <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              New Loan Eligibility
              <span className="block text-orange-300">Evaluation</span>
            </h1>

            <p className="mt-3 max-w-xl text-sm text-slate-300 leading-relaxed">
              Share your applicant, income, credit and loan details to generate
              an AI-powered eligibility assessment with explainable insights.
            </p>
          </div>

          <div className="w-full lg:w-72 shrink-0 rounded-2xl border border-white/10 bg-white/[0.07] p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                  Form completion
                </p>
                <p className="mt-1 text-2xl font-black text-white tabular-nums">
                  {completedFields}
                  <span className="text-base text-slate-400">/18</span>
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-orange-400/15 text-orange-300 flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-orange-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-2 text-[11px] text-slate-400">
              Complete all required fields to continue
            </p>
          </div>
        </div>
      </div>

      <Alert
        type="error"
        message={serverError}
        onClose={() => setServerError(null)}
      />

      <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">

        {/* 1. Applicant Profile */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 lg:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 text-brand-primary flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-navy-900">
                1. Applicant Profile
              </h3>
              <p className="text-xs text-slate-500">
                Demographic and household parameters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <InputField
              label="Age (Years)"
              name="Age"
              type="number"
              value={formData.Age}
              onChange={handleInputChange}
              required
              min={18}
              max={100}
              error={fieldErrors.Age}
            />

            <SelectField
              label="Gender"
              name="Gender"
              value={formData.Gender}
              onChange={handleInputChange}
              options={["Male", "Female"]}
              required
              error={fieldErrors.Gender}
            />

            <SelectField
              label="Marital Status"
              name="Marital_Status"
              value={formData.Marital_Status}
              onChange={handleInputChange}
              options={["Married", "Single"]}
              required
              error={fieldErrors.Marital_Status}
            />

            <SelectField
              label="Education Level"
              name="Education_Level"
              value={formData.Education_Level}
              onChange={handleInputChange}
              options={["Graduate", "Not Graduate"]}
              required
              error={fieldErrors.Education_Level}
            />

            <InputField
              label="Dependents Count"
              name="Dependents"
              type="number"
              value={formData.Dependents}
              onChange={handleInputChange}
              required
              min={0}
              max={20}
              error={fieldErrors.Dependents}
            />
          </div>
        </div>

        {/* 2. Employment & Income */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 lg:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 text-brand-primary flex items-center justify-center shrink-0">
              <Briefcase className="w-4 h-4" />
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-navy-900">
                2. Employment & Income
              </h3>
              <p className="text-xs text-slate-500">
                Monthly cash flow and liquidity
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <SelectField
              label="Employment Status"
              name="Employment_Status"
              value={formData.Employment_Status}
              onChange={handleInputChange}
              options={["Salaried", "Self-employed", "Contract", "Unemployed"]}
              required
              error={fieldErrors.Employment_Status}
            />

            <SelectField
              label="Employer Category"
              name="Employer_Category"
              value={formData.Employer_Category}
              onChange={handleInputChange}
              options={["Private", "Government", "MNC", "Business", "Unemployed"]}
              required
              error={fieldErrors.Employer_Category}
            />

            <InputField
              label="Applicant Monthly Income"
              name="Applicant_Income"
              type="number"
              value={formData.Applicant_Income}
              onChange={handleInputChange}
              prefix="&#8377;"
              required
              min={0}
              error={fieldErrors.Applicant_Income}
            />

            <InputField
              label="Co-applicant Monthly Income"
              name="Coapplicant_Income"
              type="number"
              value={formData.Coapplicant_Income}
              onChange={handleInputChange}
              prefix="&#8377;"
              required
              min={0}
              error={fieldErrors.Coapplicant_Income}
            />

            <InputField
              label="Total Liquid Savings"
              name="Savings"
              type="number"
              value={formData.Savings}
              onChange={handleInputChange}
              prefix="&#8377;"
              required
              min={0}
              error={fieldErrors.Savings}
            />
          </div>
        </div>

        {/* 3. Credit History & Liabilities */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 lg:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 text-brand-primary flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-navy-900">
                3. Credit Score & Liabilities
              </h3>
              <p className="text-xs text-slate-500">
                Bureau score and active debt-to-income commitment
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            <InputField
              label="Credit Bureau Score (300 - 900)"
              name="Credit_Score"
              type="number"
              value={formData.Credit_Score}
              onChange={handleInputChange}
              required
              min={300}
              max={900}
              error={fieldErrors.Credit_Score}
              extraLabelAction={
                <a
                  href="https://www.cibil.com/freecreditscore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-primary hover:underline"
                >
                  <span>Check CIBIL Score</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              }
            />

            <InputField
              label="Active Existing Loans Count"
              name="Existing_Loans"
              type="number"
              value={formData.Existing_Loans}
              onChange={handleInputChange}
              required
              min={0}
              max={50}
              error={fieldErrors.Existing_Loans}
            />

            <InputField
              label="Debt-to-Income (DTI) Ratio"
              name="DTI_Ratio"
              type="number"
              value={formData.DTI_Ratio}
              onChange={handleInputChange}
              suffix="%"
              required
              min={0}
              max={100}
              step="any"
              error={fieldErrors.DTI_Ratio}
              helperText="Percentage of income servicing debt"
            />
          </div>
        </div>

        {/* 4. Loan Request & Security */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-7 lg:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 text-brand-primary flex items-center justify-center shrink-0">
              <Banknote className="w-4 h-4" />
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-navy-900">
                4. Loan Request & Collateral
              </h3>
              <p className="text-xs text-slate-500">
                Principal required, tenure, and pledged security
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <InputField
              label="Requested Loan Amount"
              name="Loan_Amount"
              type="number"
              value={formData.Loan_Amount}
              onChange={handleInputChange}
              prefix="&#8377;"
              required
              min={1000}
              error={fieldErrors.Loan_Amount}
            />

            <InputField
              label="Repayment Term (Months)"
              name="Loan_Term"
              type="number"
              value={formData.Loan_Term}
              onChange={handleInputChange}
              suffix="Months"
              required
              min={6}
              max={360}
              error={fieldErrors.Loan_Term}
              helperText="e.g. 36 mos (3 yrs), 60 mos (5 yrs)"
            />

            <SelectField
              label="Loan Purpose"
              name="Loan_Purpose"
              value={formData.Loan_Purpose}
              onChange={handleInputChange}
              options={["Home", "Business", "Car", "Education", "Personal"]}
              required
              error={fieldErrors.Loan_Purpose}
            />

            <SelectField
              label="Property Area"
              name="Property_Area"
              value={formData.Property_Area}
              onChange={handleInputChange}
              options={["Urban", "Semiurban", "Rural"]}
              required
              error={fieldErrors.Property_Area}
            />

            <InputField
              label="Collateral Valuation Value"
              name="Collateral_Value"
              type="number"
              value={formData.Collateral_Value}
              onChange={handleInputChange}
              prefix="&#8377;"
              required
              min={0}
              error={fieldErrors.Collateral_Value}
            />
          </div>
        </div>

        {/* Submit Bar */}
       <div className="bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-5">
  <button
    type="submit"
    disabled={submitting}
    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-brand-primary hover:bg-brand-hover text-white text-sm font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {submitting ? (
      <span>Running ML Model...</span>
    ) : (
      <>
        <span>Evaluate Loan Eligibility</span>
        <ChevronRight className="w-4 h-4" />
      </>
    )}
  </button>
</div>
      </form>
    </div>
  );
}
