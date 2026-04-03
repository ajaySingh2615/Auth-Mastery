import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { ApiError } from "@common/utils/api-error";

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const messages = Object.values(fieldErrors).flat().join(", ");
      throw ApiError.badRequest(messages);
    }

    req.body = result.data;
    next();
  };
};
