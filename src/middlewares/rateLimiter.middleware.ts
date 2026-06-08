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
  const count = await redisClient.get(key);
  const maxRequest = 20;
  if (!count) {
    await redisClient.set(key, 1, "EX", 300);
    return;
  } else if (parseInt(count) < maxRequest) {
    await redisClient.incr(key);
    return;
  }
  const expiry = await redisClient.ttl(key);
  throw new ApiError(
    429,
    "TOO_MANY_REQUESTS",
    `Maximum request limit reached. Try again in ${expiry} seconds`
  );
};
