import { config } from "../config/env.js";

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  // Log server errors for observability
  if (statusCode >= 500) {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(config.nodeEnv === "development" && { stack: err.stack })
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.method} ${req.originalUrl}`
  });
}
