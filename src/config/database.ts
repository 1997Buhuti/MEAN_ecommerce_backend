import dns from "dns";
import { env } from "./env";
import mongoose from "mongoose";

// Local workaround: some ISP/router DNS (e.g. fe80::1) refuse SRV lookups that
// mongodb+srv:// needs, causing querySrv ECONNREFUSED. Skip in production.
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

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
