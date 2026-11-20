import mongoose from "mongoose";
import { config } from "./env.js";

let isConnected = false;

export async function connectDB(uri = config.mongoUri) {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    isConnected = true;
    console.log(`[MongoDB] Connected to database: ${conn.connection.name} @ ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    // If not running tests, exit process
    if (config.nodeEnv !== "test") {
      process.exit(1);
    }
    throw error;
  }
}

export async function disconnectDB() {
  if (!isConnected) {
    return;
  }
  await mongoose.disconnect();
  isConnected = false;
  console.log("[MongoDB] Disconnected from database.");
}
