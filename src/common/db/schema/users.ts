import {
  uuid,
  text,
  boolean,
  timestamp,
  pgEnum,
  pgTable,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Define the role enum
export const userRoleEnum = pgEnum("user_role", [
  "customer",
  "seller",
  "admin",
]);

// Define the users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull().default("customer"),
  isVerified: boolean("is_verified").notNull().default(false),
  verificationToken: text("verification_token"),
  refreshToken: text("refresh_token"),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`now()`),
});

export const User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
