import axios from "axios";
import { config } from "../config/env.js";

const client = axios.create({
  baseURL: config.mlServiceUrl,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

/**
 * Sends validated 18 loan features to the Python ML service.
 */
export async function getMLPrediction(features) {
  try {
    const response = await client.post("/predict", features);
    return response.data;
  } catch (error) {
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ETIMEDOUT" ||
      error.code === "ECONNABORTED"
    ) {
      const err = new Error(
        "Machine Learning inference service is currently unreachable. Please ensure the Python service is running on port 8001."
      );
      err.statusCode = 503;
      throw err;
    }

    if (error.response) {
      const err = new Error(
        error.response.data?.detail || "Prediction service returned an error."
      );
      err.statusCode = error.response.status || 500;
      throw err;
    }

    throw error;
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
    if (
      error.code === "ECONNREFUSED" ||
      error.code === "ETIMEDOUT" ||
      error.code === "ECONNABORTED"
    ) {
      const err = new Error(
        "Machine Learning explanation service is currently unreachable. Please ensure the Python service is running on port 8001."
      );
      err.statusCode = 503;
      throw err;
    }

    if (error.response) {
      const err = new Error(
        error.response.data?.detail || "Explanation service returned an error."
      );
      err.statusCode = error.response.status || 500;
      throw err;
    }

    throw error;
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
