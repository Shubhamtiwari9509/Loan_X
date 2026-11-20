import { z } from "zod";

export const createPredictionSchema = z.object({
  Applicant_Income: z
    .number({ required_error: "Applicant_Income is required" })
    .min(0, "Applicant income cannot be negative"),
  Coapplicant_Income: z
    .number()
    .min(0, "Co-applicant income cannot be negative")
    .default(0),
  Employment_Status: z.enum(
    ["Contract", "Salaried", "Self-employed", "Unemployed"],
    { errorMap: () => ({ message: "Employment_Status must be Contract, Salaried, Self-employed, or Unemployed" }) }
  ),
  Age: z
    .number({ required_error: "Age is required" })
    .min(18, "Age must be at least 18")
    .max(100, "Age cannot exceed 100"),
  Marital_Status: z.enum(
    ["Married", "Single"],
    { errorMap: () => ({ message: "Marital_Status must be Married or Single" }) }
  ),
  Dependents: z
    .number()
    .min(0, "Dependents cannot be negative")
    .max(20, "Dependents cannot exceed 20")
    .default(0),
  Credit_Score: z
    .number({ required_error: "Credit_Score is required" })
    .min(300, "Credit score cannot be lower than 300")
    .max(900, "Credit score cannot exceed 900"),
  Existing_Loans: z
    .number()
    .min(0, "Existing loans count cannot be negative")
    .max(50, "Existing loans count cannot exceed 50")
    .default(0),
  DTI_Ratio: z
    .number({ required_error: "DTI_Ratio is required" })
    .transform((val) => (val > 1.0 && val <= 100.0 ? val / 100.0 : val))
    .pipe(
      z
        .number()
        .min(0.0, "DTI ratio cannot be negative")
        .max(1.0, "DTI ratio must be between 0.0 and 1.0 (or 0% to 100%)")
    ),
  Savings: z
    .number()
    .min(0, "Savings cannot be negative")
    .default(0),
  Collateral_Value: z
    .number()
    .min(0, "Collateral value cannot be negative")
    .default(0),
  Loan_Amount: z
    .number({ required_error: "Loan_Amount is required" })
    .positive("Loan amount must be greater than zero"),
  Loan_Term: z
    .number({ required_error: "Loan_Term is required" })
    .min(6, "Loan term must be at least 6 months")
    .max(360, "Loan term cannot exceed 360 months (30 years)"),
  Loan_Purpose: z.enum(
    ["Business", "Car", "Education", "Home", "Personal"],
    { errorMap: () => ({ message: "Loan_Purpose must be Business, Car, Education, Home, or Personal" }) }
  ),
  Property_Area: z.enum(
    ["Rural", "Semiurban", "Urban"],
    { errorMap: () => ({ message: "Property_Area must be Rural, Semiurban, or Urban" }) }
  ),
  Education_Level: z.enum(
    ["Graduate", "Not Graduate"],
    { errorMap: () => ({ message: "Education_Level must be Graduate or Not Graduate" }) }
  ),
  Gender: z.enum(
    ["Female", "Male"],
    { errorMap: () => ({ message: "Gender must be Female or Male" }) }
  ),
  Employer_Category: z.enum(
    ["Business", "Government", "MNC", "Private", "Unemployed"],
    { errorMap: () => ({ message: "Employer_Category must be Business, Government, MNC, Private, or Unemployed" }) }
  )
});
