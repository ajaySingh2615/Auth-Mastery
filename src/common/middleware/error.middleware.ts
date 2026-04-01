import { Request, Response, NextFunction } from "express";
import { env } from "@common/config/env";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (env.NODE_ENV === "development") {
    console.error("Error: ", err);
  }

  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(env.NODE_ENV === "development" && { stack: err.stack }),
    });
    return;
  }
  res.status(500).json({
    success: false,
    message: "Internal server error",
    // Only expose real error in dev — NEVER in production
    ...(env.NODE_ENV === "development" && {
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    }),
  });
};
