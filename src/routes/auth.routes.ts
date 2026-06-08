import { Router } from "express";
import { globalRateLimiter } from "../middlewares/rateLimiter.middleware.js";
import { validator } from "../middlewares/validator.middleware.js";
import {
  signInSchema,
  signUpSchema,
  verifySignInOrUpSchema,
} from "../validators/user.validator.js";
import otpGenerationRateLimiter from "../middlewares/otpGenerateRateLimiter.middleware.js";
import {
  completeSignIn,
  completeSignUp,
  initSignIn,
  initSignUp,
  refreshAccessToken,
} from "../controllers/auth.controller.js";
import otpVerificationRateLimiter from "../middlewares/otpVerifyRateLimiter.middleware.js";

export const authRouter = Router();

authRouter.post(
  "/sign-up",
  globalRateLimiter,
  validator(signUpSchema),
  otpGenerationRateLimiter,
  initSignUp
);
authRouter.post(
  "/sign-in",
  globalRateLimiter,
  validator(signInSchema),
  otpGenerationRateLimiter,
  initSignIn
);
authRouter.post(
  "/verify/sign-up",
  globalRateLimiter,
  validator(verifySignInOrUpSchema),
  otpVerificationRateLimiter,
  completeSignUp
);
authRouter.post(
  "/verify/sign-in",
  globalRateLimiter,
  validator(verifySignInOrUpSchema),
  otpVerificationRateLimiter,
  completeSignIn
);
authRouter.post("/refresh", globalRateLimiter, refreshAccessToken);
