import mongoose from "mongoose";
import { Prediction } from "../models/Prediction.js";
import { getMLExplanation } from "../services/mlClient.js";
import {
  generateLoanAdvisorResponse,
  generateLoanImprovementSuggestions,
} from "../services/aiAdvisorService.js";

// Existing AI Loan Advisor
export async function askLoanAdvisor(req, res, next) {
  try {
    const {
      predictionId,
      question,
      conversationHistory = [],
    } = req.body;

    if (!mongoose.isValidObjectId(predictionId)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid prediction ID.",
      });
    }

    if (
      typeof question !== "string" ||
      !question.trim() ||
      question.trim().length > 1000
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Question is required and must not exceed 1000 characters.",
      });
    }

    if (
      !Array.isArray(conversationHistory) ||
      conversationHistory.length > 8
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation history.",
      });
    }

    const prediction = await Prediction.findById(
      predictionId
    ).lean();

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction record not found.",
      });
    }

    const isOwner =
      prediction.userId.toString() ===
      req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You cannot ask questions about this prediction.",
      });
    }

    const safeHistory = conversationHistory.map(
      (message) => {
        if (
          !message ||
          !["user", "assistant"].includes(message.role) ||
          typeof message.content !== "string" ||
          !message.content.trim() ||
          message.content.length > 1000
        ) {
          const error = new Error(
            "Invalid conversation message."
          );
          error.statusCode = 400;
          throw error;
        }

        return {
          role: message.role,
          content: message.content.trim(),
        };
      }
    );

    const explanation = await getMLExplanation(
      prediction.inputFeatures
    );

    const answer = await generateLoanAdvisorResponse({
      prediction,
      explanation,
      question: question.trim(),
      conversationHistory: safeHistory,
    });

    return res.status(200).json({
      success: true,
      predictionId: prediction._id,
      answer,
    });
  } catch (error) {
    next(error);
  }
}

// NEW: AI-Powered Loan Improvement Suggestions
export async function getLoanImprovementSuggestions(
  req,
  res,
  next
) {
  try {
    const { predictionId } = req.body;

    // Validate prediction ID
    if (!mongoose.isValidObjectId(predictionId)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid prediction ID.",
      });
    }

    // Fetch saved prediction from database
    const prediction = await Prediction.findById(
      predictionId
    ).lean();

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction record not found.",
      });
    }

    // Verify ownership or admin access
    const isOwner =
      prediction.userId.toString() ===
      req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You cannot view suggestions for this prediction.",
      });
    }

    // Generate fresh SHAP explanation
    const explanation = await getMLExplanation(
      prediction.inputFeatures
    );

    // Generate personalized improvement plan using Groq
    const improvementPlan =
      await generateLoanImprovementSuggestions({
        prediction,
        explanation,
      });

    return res.status(200).json({
      success: true,
      predictionId: prediction._id,
      improvementPlan,
    });
  } catch (error) {
    next(error);
  }
}
