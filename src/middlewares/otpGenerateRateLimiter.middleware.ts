import { redisClient } from "../db/redis.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError.js";
import type { SignUpUser } from "../validators/user.validator.js";

const otpGenerationRateLimiter = asyncHandler(
  async (
    req: Request<{}, {}, SignUpUser>,
    res: Response,
    next: NextFunction
  ) => {
    const lockKey = `otp:lock:generate:${req.body.email}`;
    const isLockAccuired = await redisClient.set(lockKey, 1, "PX", 30000, "NX");
    if (isLockAccuired === null) {
      throw new ApiError(
        429,
        "TOO_MANY_REQUEST",
        "Please wait for 30 seconds brfore attempting again."
      );
    }
    next();
  }
);

export default otpGenerationRateLimiter;
