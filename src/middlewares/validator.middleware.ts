import type { ZodObject, ZodType } from "zod";
import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import ApiError from "../utils/ApiError.js";

type RequestSchema = ZodObject<{
  body?: ZodType;
}>;

export const validator = (schema: RequestSchema) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = await schema.parseAsync({
        body: req.body,
      });

      req.body = parsedData.body;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationIssues = error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));

        const summaryMessage = validationIssues
          .map((is) => `${is.field}: ${is.message}`)
          .join(", ");

        throw new ApiError(
          400,
          "VALIDATION_ERROR",
          summaryMessage || error.message,
          validationIssues
        );
      }
      throw error;
    }
  });
