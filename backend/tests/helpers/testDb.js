import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { config } from "../../src/config/env.js";

export function generateTestToken(userId, role = "user") {
  return jwt.sign(
    { id: userId.toString(), role },
    config.jwtSecret,
    { expiresIn: "1h" }
  );
}

export const sampleUserId = new mongoose.Types.ObjectId("65b000000000000000000001");
export const sampleOtherUserId = new mongoose.Types.ObjectId("65b000000000000000000002");
export const sampleAdminId = new mongoose.Types.ObjectId("65b000000000000000000099");

export const sampleValidInputFeatures = {
  Applicant_Income: 25000.0,
  Coapplicant_Income: 10000.0,
  Employment_Status: "Salaried",
  Age: 38.0,
  Marital_Status: "Married",
  Dependents: 1.0,
  Credit_Score: 780.0,
  Existing_Loans: 0.0,
  DTI_Ratio: 0.20,
  Savings: 20000.0,
  Collateral_Value: 50000.0,
  Loan_Amount: 15000.0,
  Loan_Term: 36.0,
  Loan_Purpose: "Home",
  Property_Area: "Urban",
  Education_Level: "Graduate",
  Gender: "Male",
  Employer_Category: "MNC"
};
