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

  // .select returns an array - so we check index 0
  if (existing[0]) throw ApiError.conflict("User already exists");

  // step 2 - hash password
  const hashedPassword = await bcrypt.hash(data.password, 12);

  // step 3 - generate verification token
  // raw token - goes to user's email
  // hashed token - stored in the database
  const { rawToken, hashedToken } = generateResetToken();

  // step 4 - insert user into the database
  const [newUser] = await db
    .insert(users)
    .values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      verificationToken: hashedToken,
    })
    .returning();

  // step 5 - send verification email
  // user is created successfully - even if email fails
  // TODO: wire up email service
  try {
    // await sendVerificationEmail(newUser.email, rawToken);
    console.log(`Verification token for ${newUser.email}: ${rawToken}`);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw ApiError.internal("Failed to send verification email");
  }

  // step 6 - return the safe user data
  return sanitizeUser(newUser);
};

// Login
export const login = async (data: LoginDto) => {
  // step 1 - find user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, data.email))
    .limit(1);

  if (!user) throw ApiError.unauthorized("Invalid credentials");

  // step 2 - check auth provider
  // if user signed up with google, they have no password
  if (user.authProvider !== "local") {
    throw ApiError.badRequest(`please login with ${user.authProvider} account`);
  }

  // step 3 - check email verified
  if (!user.isVerified) {
    throw ApiError.forbidden("Please verify your email before logging in");
  }

  // step 4 - compare password
  // user.password can be null (social auth users) - handle that
  if (!user.password) throw ApiError.unauthorized("Invalid credentials");

  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) throw ApiError.unauthorized("Invalid credentials");

  // step 5 - generate tokens
  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

  // step 6 - store hashed refresh token in DB
  await db
    .update(users)
    .set({ refreshToken: hashToken(refreshToken) })
    .where(eq(users.id, user.id));

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken, // raw token -> goes to cookie controller
  };
};

// logout
export const logout = async (userId: string): Promise<void> => {
  await db
    .update(users)
    .set({ refreshToken: null })
    .where(eq(users.id, userId));
};

// Get Me
export const getMe = async (userId: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) throw ApiError.notFound("User not found");

  return sanitizeUser(user);
};

// Verify Email
export const verifyEmail = async (token: string) => {
  // step 1 - hash incoming token to compare with DB
  const hashedToken = hashToken(token);

  // step 2 - find user with this token
  // const [user] = await db
  //   .select()
  //   .from(users)
  //   .where(eq(users.verificationToken, hashToken))
  //   .limit(1);
};
