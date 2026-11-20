import rateLimit from "express-rate-limit";

// Rate limiter for authentication routes (login / register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many authentication attempts from this IP, please try again after 15 minutes."
  }
});

// Rate limiter for prediction inference requests
export const predictionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many prediction requests from this IP, please try again after 15 minutes."
  }
});

// Rate limiter for AI Loan Advisor
export const aiAdvisorLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message:
      "Too many AI Advisor requests. Please try again after 15 minutes."
  }
});
