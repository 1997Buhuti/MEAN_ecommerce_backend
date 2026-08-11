import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  API_URI: z.string().default("/api/v"),
  CONNECTION_STRING: z.string().url(),
  SECRET: z.string().min(16, "SECRET must be at least 16 characters"),
});

export const env = envSchema.parse(process.env);
