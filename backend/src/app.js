
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { config } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import aiAdvisorRoutes from "./routes/aiAdvisorRoutes.js";
import { checkMLHealth } from "./services/mlClient.js";

export const app = express();

// Trust Render reverse proxy
app.set("trust proxy", 1);

// Security HTTP headers
app.use(helmet());

// Allowed frontend origins
const allowedOrigins = [
  config.corsOrigin,
  "https://frontend-psi-ten-94.vercel.app"
];

// Allow current and future Vercel deployments of this project
const isAllowedVercelOrigin = (origin) => {
  return (
    /^https:\/\/frontend-[a-z0-9-]+-shubham-tiwaris-projects-43e4cb5c\.vercel\.app$/.test(origin)
  );
};

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header (e.g. server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin) ||
        isAllowedVercelOrigin(origin) ||
        origin === "http://localhost:5173"
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// Body parser
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// System health check
app.get("/health", async (req, res) => {
  const mlStatus = await checkMLHealth();

  res.status(200).json({
    status: "ok",
    service: "loanx-backend",
    nodeEnv: config.nodeEnv,
    timestamp: new Date().toISOString(),
    mlService: mlStatus
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai-advisor", aiAdvisorRoutes);

// Catch 404 and forward to error handler
app.use(notFoundHandler);

// Centralized error handler
app.use(errorHandler);
