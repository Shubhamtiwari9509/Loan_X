import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { User } from "../models/User.js";

export async function protect(req, res, next) {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required. Please provide a valid Bearer token."
    });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await User.findById(decoded.id).select("-passwordHash");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "The user belonging to this token no longer exists."
      });
    }

    req.user = user;

    // Identify recruiter demo sessions.
    req.isDemo = decoded.isDemo === true;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token."
    });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Administrator privileges required."
    });
  }

  next();
}

// Only real administrators can perform sensitive admin operations.
export function requireRealAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Administrator privileges required."
    });
  }

  if (req.isDemo) {
    return res.status(403).json({
      success: false,
      message: "This action is disabled in recruiter demo mode."
    });
  }

  next();
}
