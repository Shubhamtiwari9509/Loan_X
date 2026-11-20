import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import { config } from "./config/env.js";

async function startServer() {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`[LoanX Backend] Server running on port ${config.port} in ${config.nodeEnv} mode`);
      console.log(`[LoanX Backend] ML Service configured at ${config.mlServiceUrl}`);
    });
  } catch (error) {
    console.error("[LoanX Backend] Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
