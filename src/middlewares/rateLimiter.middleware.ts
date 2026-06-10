import { redisClient } from "../db/redis.js";
import type { AuthRequest } from "../types/user.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";

export const globalRateLimiter = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    await rateLimiter(`ip:${req.ip}`);
    return next();
  }
);

export const protectedRateLimiter = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    await rateLimiter(`user:${req.user._id}`);
    return next();
  }
);

const rateLimiter = async (key: string) => {
  const maxRequest = 20;
  const count = await redisClient.incr(key);
  if (count === 1) {
    await redisClient.expire(key, 300);
    return;
  }

  if (count > maxRequest) {
    throw new ApiError(
      429,
      "TOO_MANY_REQUESTS",
      "Please wait for 5 minutes before another request."
    );
  }

  return;
};
