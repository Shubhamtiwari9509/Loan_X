
import axios from "axios";
import { config } from "../config/env.js";

const client = axios.create({
  baseURL: config.mlServiceUrl,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});

/**
 * Handles and logs errors returned by the Python ML service.
 */
function handleMLError(error, operation) {
  if (error.response) {
    console.error(`[ML Service] ${operation} failed:`, {
      status: error.response.status,
      response: error.response.data
    });

    const responseData = error.response.data;

    const message =
      responseData?.detail ||
      responseData?.message ||
      `${operation} service returned an error.`;

    const err = new Error(
      typeof message === "string"
        ? message
        : JSON.stringify(message)
    );

    err.statusCode = error.response.status || 500;
    throw err;
  }

  console.error(`[ML Service] ${operation} connection error:`, {
    code: error.code,
    message: error.message
  });

  if (
    error.code === "ECONNREFUSED" ||
    error.code === "ETIMEDOUT" ||
    error.code === "ECONNABORTED"
  ) {
    const err = new Error(
      "Machine Learning service is currently unreachable."
    );

    err.statusCode = 503;
    throw err;
  }

  throw error;
}

/**
 * Sends validated 18 loan features to the Python ML service.
 */
export async function getMLPrediction(features) {
  try {
    const response = await client.post("/predict", features);
    return response.data;
  } catch (error) {
    handleMLError(error, "Prediction");
  }
}

/**
 * Requests TreeSHAP explanation for a loan prediction.
 */
export async function getMLExplanation(features) {
  try {
    const response = await client.post("/explain", features);
    return response.data;
  } catch (error) {
    handleMLError(error, "Explanation");
  }
}

/**
 * Checks health and connectivity of the ML service.
 */
export async function checkMLHealth() {
  try {
    const response = await client.get("/health");
    return response.data;
  } catch (error) {
    return {
      status: "unreachable",
      model_loaded: false,
      error: error.message
    };
  }
}
