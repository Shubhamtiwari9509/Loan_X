import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5001", 10),
  nodeEnv: process.env.NODE_ENV || "development",

  mongoUri:
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/loanx",

  jwtSecret:
    process.env.JWT_SECRET ||
    "loanx_default_jwt_secret_dev_key_must_be_overridden",

  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  mlServiceUrl:
    process.env.ML_SERVICE_URL || "http://127.0.0.1:8001",

  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",

  adminSeed: {
    name: process.env.ADMIN_NAME || "System Admin",
    email: (process.env.ADMIN_EMAIL || "admin@loanx.internal")
      .toLowerCase()
      .trim(),
    password:
      process.env.ADMIN_PASSWORD || "AdminSecurePassword123!",
  },

  adminInvitationCode: process.env.ADMIN_INVITATION_CODE,

  // Recruiter Demo Login
  demoLogin: {
    enabled: process.env.DEMO_LOGIN_ENABLED === "true",
    name: "Demo User",
    email: "demo@gmail.com",
  },

  // Hugging Face (old integration - temporarily retained)
  hfToken: process.env.HF_TOKEN,

  // Groq AI Advisor
  groqApiKey: process.env.GROQ_API_KEY,
  groqModel: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
};
