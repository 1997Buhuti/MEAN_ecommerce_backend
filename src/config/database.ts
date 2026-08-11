import { env } from "./env";
import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(env.CONNECTION_STRING, {
      dbName: "ecommerce-db",
    });
    console.log("Database Connection is ready...");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  console.log("MongoDB disconnected");
};
