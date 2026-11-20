import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { config } from "../config/env.js";
import { User } from "../models/User.js";

function generateToken(user, extraClaims = {}) {
  return jwt.sign(
    { id: user._id, role: user.role, ...extraClaims },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

function isValidInvitationCode(candidate, configuredCode) {
  if (!configuredCode || !candidate) return false;

  const candidateBuffer = Buffer.from(candidate);
  const configuredBuffer = Buffer.from(configuredCode);

  if (candidateBuffer.length !== configuredBuffer.length) {
    return false;
  }

  return timingSafeEqual(candidateBuffer, configuredBuffer);
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists."
      });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: "user"
    });

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
}

export async function registerAdmin(req, res, next) {
  try {
    const { name, email, password, invitationCode } = req.body;

    if (!config.adminInvitationCode) {
      return res.status(503).json({
        success: false,
        message: "Admin registration is currently unavailable."
      });
    }

    if (!isValidInvitationCode(invitationCode, config.adminInvitationCode)) {
      return res.status(403).json({
        success: false,
        message: "Invalid admin invitation code."
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email address already exists."
      });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = await User.create({
      name,
      email,
      passwordHash,
      role: "admin"
    });

    const token = generateToken(admin);

    return res.status(201).json({
      success: true,
      message: "Admin registration successful.",
      token,
      user: admin.toJSON()
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+passwordHash");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
}

// Recruiter demo login
export async function demoLogin(req, res, next) {
  try {
    if (!config.demoLogin.enabled) {
      return res.status(503).json({
        success: false,
        message: "Demo login is currently unavailable."
      });
    }

    const { name, email } = config.demoLogin;

    let demoUser = await User.findOne({ email });

    if (!demoUser) {
      const randomPassword = randomBytes(32).toString("hex");
      const passwordHash = await bcrypt.hash(randomPassword, 12);

      try {
        demoUser = await User.create({
          name,
          email,
          passwordHash,
          role: "admin"
        });
      } catch (error) {
        // Handle simultaneous first-time demo login requests.
        if (error.code !== 11000) {
          throw error;
        }

        demoUser = await User.findOne({ email });
      }
    }

    // Never silently convert an existing account into a demo admin.
    if (
      !demoUser ||
      demoUser.name !== name ||
      demoUser.role !== "admin"
    ) {
      return res.status(503).json({
        success: false,
        message: "Demo account is not configured correctly."
      });
    }

    const token = generateToken(demoUser, { isDemo: true });

    return res.status(200).json({
      success: true,
      message: "Demo login successful.",
      token,
      user: demoUser.toJSON()
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      user: req.user.toJSON()
    });
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req, res, next) {
  try {
    const { name } = req.body;

    if (name) {
      req.user.name = name;
      await req.user.save();
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: req.user.toJSON()
    });
  } catch (error) {
    next(error);
  }
}
