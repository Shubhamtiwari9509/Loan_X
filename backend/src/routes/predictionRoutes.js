import express from "express";
import {
  createPrediction,
  getPredictionById,
  getUserPredictions,
  getPredictionExplanation
} from "../controllers/predictionController.js";

import { protect } from "../middleware/auth.js";
import { predictionLimiter } from "../middleware/rateLimiter.js";
import { validateBody } from "../middleware/validate.js";
import { createPredictionSchema } from "../validation/predictionValidation.js";

const router = express.Router();

router.use(protect);

router.post(
  "/",
  predictionLimiter,
  validateBody(createPredictionSchema),
  createPrediction
);

router.get("/", getUserPredictions);

router.get("/:id/explanation", getPredictionExplanation);

router.get("/:id", getPredictionById);

export default router;
