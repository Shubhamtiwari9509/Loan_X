 import { Prediction } from "../models/Prediction.js";
import {
  getMLPrediction,
  getMLExplanation
} from "../services/mlClient.js";

export async function createPrediction(req, res, next) {
  try {
    const inputFeatures = req.body;

    const mlResult = await getMLPrediction(inputFeatures);

    const prediction = await Prediction.create({
      userId: req.user._id,
      inputFeatures,
      predictedClass: mlResult.predicted_class,
      decision: mlResult.decision,
      approvalProbability: mlResult.approval_probability,
      rejectionProbability: mlResult.rejection_probability,
      modelVersion: mlResult.model_version,
      disclaimer: mlResult.disclaimer
    });

    res.status(201).json({
      success: true,
      message: "Loan evaluation completed successfully.",
      prediction
    });
  } catch (error) {
    next(error);
  }
}

export async function getUserPredictions(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit || "10", 10))
    );

    const skip = (page - 1) * limit;
    const query = { userId: req.user._id };

    if (req.query.decision) {
      query.decision = req.query.decision;
    }

    const [predictions, total] = await Promise.all([
      Prediction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Prediction.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      predictions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function getPredictionById(req, res, next) {
  try {
    const { id } = req.params;

    const prediction = await Prediction.findById(id).lean();

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction record not found."
      });
    }

    const isOwner =
      prediction.userId.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You do not have permission to view this prediction record."
      });
    }

    res.status(200).json({
      success: true,
      prediction
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Generates a TreeSHAP explanation for an existing prediction.
 * Applicants do not receive Age and Gender contributions.
 * Admins can access all 18 feature contributions.
 */
export async function getPredictionExplanation(req, res, next) {
  try {
    const { id } = req.params;

    const prediction = await Prediction.findById(id).lean();

    if (!prediction) {
      return res.status(404).json({
        success: false,
        message: "Prediction record not found."
      });
    }

    const isOwner =
      prediction.userId.toString() === req.user._id.toString();

    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied. You do not have permission to view this explanation."
      });
    }

    const mlExplanation = await getMLExplanation(
      prediction.inputFeatures
    );

    let explanation = mlExplanation;

    if (!isAdmin) {
      const visibleContributions =
        mlExplanation.contributions.filter(
          (item) =>
            item.feature !== "Age" &&
            item.feature !== "Gender"
        );

      const visibleTopFactors = [...visibleContributions]
        .sort(
          (a, b) =>
            Math.abs(b.contribution) -
            Math.abs(a.contribution)
        )
        .slice(0, 5);

      explanation = {
        ...mlExplanation,
        contributions: visibleContributions,
        top_factors: visibleTopFactors,
        disclaimer:
          `${mlExplanation.disclaimer} Applicant view excludes Age and Gender contributions. The displayed factors are a subset of the full model explanation. The model may still use these features.`
      };
    }

    res.status(200).json({
      success: true,
      predictionId: prediction._id,
      explanation
    });
  } catch (error) {
    next(error);
  }
}
