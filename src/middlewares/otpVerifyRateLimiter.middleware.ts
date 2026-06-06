import { redisClient } from "../db/redis.js";
import { ConvertToNumber } from "../utils/StringToNumber.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { User } from "../types/user.js";
import type { Request } from "express";

const otpVerificationRateLimiter = asyncHandler(
  async (req: Request<{}, {}, User>, res, next) => {
    const currentTime = Date.now();
    const otpKey = `otp:${req.body.email}`;
    const requestAttemptRecord = await redisClient.hgetall(otpKey);
    const record = requestAttemptRecord ? requestAttemptRecord : null;
    const requestWindow = 15000;
    if (!record || Object.keys(record).length === 0) {
      throw new ApiError(404, "NOT_FOUND", "Otp not found or expired.");
    }
    const lastAttemptAt = ConvertToNumber(record.lastAttemptAt as string);
    if (currentTime - lastAttemptAt <= requestWindow) {
      const timeLeft = Math.floor(
        (requestWindow - (currentTime - lastAttemptAt)) / 1000
      );
      throw new ApiError(
        429,
        "RATE_LIMIT_EXCEED",
        `Please re-attempt after ${timeLeft} seconds`
      );
    }
    const attempt = ConvertToNumber(record.attempt as string);
    if (attempt >= 5) {
      throw new ApiError(
        429,
        "ATTEMPT_EXCEED",
        "Max attempt reached. Please attempt with new OTP."
      );
    }

    next();
  }
);

export default otpVerificationRateLimiter;
