import express from "express";

import {
  getMe,
  login,
  register,
  registerAdmin,
  updateMe,
  demoLogin
} from "../controllers/authController.js";

import { protect } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateBody } from "../middleware/validate.js";

import {
  loginSchema,
  registerSchema,
  adminRegisterSchema,
  updateProfileSchema
} from "../validation/authValidation.js";

const router = express.Router();

router.post(
  "/register",
  authLimiter,
  validateBody(registerSchema),
  register
);

router.post(
  "/register-admin",
  authLimiter,
  validateBody(adminRegisterSchema),
  registerAdmin
);

router.post(
  "/login",
  authLimiter,
  validateBody(loginSchema),
  login
);

router.post(
  "/demo-login",
  authLimiter,
  demoLogin
);

router.get("/me", protect, getMe);

router.put(
  "/me",
  protect,
  validateBody(updateProfileSchema),
  updateMe
);

export default router;
