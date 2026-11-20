import express from "express";
import { protect } from "../middleware/auth.js";
import { aiAdvisorLimiter } from "../middleware/rateLimiter.js";
import {
  askLoanAdvisor,
  getLoanImprovementSuggestions,
} from "../controllers/aiAdvisorController.js";

const router = express.Router();

// All AI requests require authentication
router.use(protect);

// Existing AI Loan Advisor
router.post("/", aiAdvisorLimiter, askLoanAdvisor);

// NEW: AI-Powered Loan Improvement Suggestions
router.post(
  "/improvement-suggestions",
  aiAdvisorLimiter,
  getLoanImprovementSuggestions
);

export default router;
