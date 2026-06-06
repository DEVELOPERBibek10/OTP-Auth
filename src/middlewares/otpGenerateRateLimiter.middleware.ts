import { redisClient } from "../db/redis.js";
import type { SignUpUser } from "../types/user.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";
import { ConvertToNumber } from "../utils/StringToNumber.js";
import ApiError from "../utils/ApiError.js";

const otpGenerationRateLimiter = asyncHandler(
  async (
    req: Request<{}, {}, SignUpUser>,
    res: Response,
    next: NextFunction
  ) => {
    const currentTime = Date.now();
    const otpKey = `otp:${req.body.email}`;
    const requestWindow = 30000;
    const otpRecord = await redisClient.hgetall(otpKey);
    if (otpRecord && Object.keys(otpRecord).length > 0) {
      const createdAt = ConvertToNumber(otpRecord.createdAt as string);
      if (currentTime - createdAt <= requestWindow) {
        const timeLeft = Math.floor(
          (requestWindow - (currentTime - createdAt)) / 1000
        );
        throw new ApiError(
          429,
          "TOO_MANY_REQUEST",
          `Please re-attempt after ${timeLeft} seconds`
        );
      }
    }
    next();
  }
);

export default otpGenerationRateLimiter;
