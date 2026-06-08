import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { protectedRateLimiter } from "../middlewares/rateLimiter.middleware.js";
import { getCurrentUser } from "../controllers/user.controller.js";

export const userRouter = Router();

userRouter.get(
  "/current-user",
  verifyJWT,
  protectedRateLimiter,
  getCurrentUser
);
