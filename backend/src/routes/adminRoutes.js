import express from "express";
import {
  getAllPredictions,
  getAllUsers,
  getOverviewStats,
  updateUserRole
} from "../controllers/adminController.js";

import {
  protect,
  requireAdmin,
  requireRealAdmin
} from "../middleware/auth.js";

const router = express.Router();

// All admin routes require authentication and admin role.
router.use(protect, requireAdmin);

// Read-only dashboard routes
router.get("/stats", getOverviewStats);
router.get("/predictions", getAllPredictions);
router.get("/users", getAllUsers);

// Only real administrators can change user roles.
router.patch(
  "/users/:id/role",
  requireRealAdmin,
  updateUserRole
);

export default router;
