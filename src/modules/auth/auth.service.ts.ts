import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { db } from "@common/db";
import { users } from "@common/db/schema";
import { ApiError } from "@common/utils/api-error";
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
} from "@common/utils/jwt.utils";
import type { RegisterDto } from "@modules/auth/dto/register.dto";
import type { LoginDto } from "@modules/auth/dto/login.dto";

const hashToken = (token: string): string =>
  crypto.createHash("sha256").update(token).digest("hex");

const sanitizeUser = (user: typeof users.$inferSelect) => {
  const {
    password,
    refreshToken,
    verificationToken,
    resetPasswordToken,
    resetPasswordExpires,
    ...safeUser
  } = user;
  return safeUser;
};

// Register
export const register = async (data: RegisterDto) => {
  // step 1 - check existing user
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);
};
