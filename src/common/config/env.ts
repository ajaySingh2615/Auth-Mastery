import { z } from "zod";
import "dotenv/config";

// step 1: define the shape of the entire .env file
// think of this as a contract - if the app starts, these will exists
const envSchema = z.object({
  // App
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("5000"),

  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // JWT
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_REFRESH_SECRET: z.string().min(1, "JWT_REFRESH_SECRET is required"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  // Email
  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  SMTP_PORT: z.string().default("587"),
  SMTP_USER: z.string().min(1, "SMTP_USER is required"),
  SMTP_PASSWORD: z.string().min(1, "SMTP_PASSWORD is required"),
  SMTP_FROM_EMAIL: z
    .string()
    .min(1, "SMTP_FROM_EMAIL must be a valid email address"),
});

// Step 2: Try to validate process.env against the schema
// safeParse = won't throw, it returns {success, data, error}
const parsedEnv = envSchema.safeParse(process.env);

// Step 3 — If validation fails, tell the developer EXACTLY what's missing
// and kill the process before the app even starts
if (!parsedEnv.success) {
  console.error(
    "Invalid enviroment variables - fix these before starting the app",
  );
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;
