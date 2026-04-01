import jwt, { type SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { env } from "@common/config/env";

interface AccessTokenPayload {
  id: string;
  role: string;
}

interface RefreshTokenPayload {
  id: string;
}

export interface DecodedAccessToken extends AccessTokenPayload {
  iat: number;
  exp: number;
}

export interface DecodedRefreshToken extends RefreshTokenPayload {
  iat: number;
  exp: number;
}

export const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string): DecodedAccessToken => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as DecodedAccessToken;
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

export const verifyRefreshToken = (token: string): DecodedRefreshToken => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as DecodedRefreshToken;
};

export const generateResetToken = (): {
  rawToken: string;
  hashedToken: string;
} => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  return { rawToken, hashedToken };
};
