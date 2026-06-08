import { redisClient } from "../db/redis.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { Request } from "express";
import type { SignInUser } from "../validators/user.validator.js";

const otpVerificationRateLimiter = asyncHandler(
  async (req: Request<{}, {}, SignInUser>, res, next) => {
    const otpKey = `otp:${req.body.email}`;
    const lockKey = `otp:lock:verify:${req.body.email}`;
    const otpExists = await redisClient.exists(otpKey);
    if (!otpExists) {
      throw new ApiError(404, "NOT_FOUND", "Otp not found or expired.");
    }
    const isLockAccuired = await redisClient.set(lockKey, 1, "PX", 15000, "NX");
    if (isLockAccuired === null) {
      throw new ApiError(
        429,
        "TOO_MANY_REQUEST",
        "Please wait for 15 seconds brfore attempting again."
      );
    }
    const currentAttempt = await redisClient.hincrby(otpKey, "attempts", 1);
    if (currentAttempt > 5) {
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
