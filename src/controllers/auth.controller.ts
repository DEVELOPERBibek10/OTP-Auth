import {
  accessTokenOptions,
  refreshTokenOptions,
} from "../constants/cookieOption.js";
import authService from "../services/auth.service.js";
import ApiError from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import type {
  SignInUser,
  SignUpUser,
  VerifySignInOrUp,
} from "../validators/user.validator.js";
import type { Request, Response } from "express";

export const initSignUp = asyncHandler(
  async (req: Request<{}, {}, SignUpUser>, res: Response) => {
    const emailInfo = await authService.initiateSignUp(
      req.body.username,
      req.body.email
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          `OTP sent sucessfully to ${emailInfo.accepted[0]}`
        )
      );
  }
);

export const completeSignUp = asyncHandler(
  async (req: Request<{}, {}, VerifySignInOrUp>, res: Response) => {
    const response = await authService.completeSignUp(
      req.body.email,
      req.body.otp
    );

    return res
      .status(200)
      .cookie("accessToken", response.accessToken, accessTokenOptions)
      .cookie("refreshToken", response.refreshToken, refreshTokenOptions)
      .json(
        new ApiResponse(
          200,
          response.user,
          `Welcome ${response.user.username}!`
        )
      );
  }
);

export const initSignIn = asyncHandler(
  async (req: Request<{}, {}, SignInUser>, res: Response) => {
    const emailInfo = await authService.initiateSignIn(req.body.email);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          `OTP sent sucessfully to ${emailInfo.accepted[0]}`
        )
      );
  }
);

export const completeSignIn = asyncHandler(
  async (req: Request<{}, {}, VerifySignInOrUp>, res: Response) => {
    const response = await authService.completeSignIn(
      req.body.email,
      req.body.otp
    );

    return res
      .status(200)
      .cookie("accessToken", response.accessToken, accessTokenOptions)
      .cookie("refreshToken", response.refreshToken, refreshTokenOptions)
      .json(
        new ApiResponse(
          200,
          response.user,
          `Welcome back ${response.user.username}!`
        )
      );
  }
);

export const signOut = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  res
    .clearCookie("accessToken", accessTokenOptions)
    .clearCookie("refreshToken", refreshTokenOptions);

  if (!refreshToken) {
    throw new ApiError(401, "UNAUTHORIZED", "Unauthorized sign out request.");
  }

  const user = await authService.signOut(refreshToken);

  if (!user) {
    throw new ApiError(401, "UNAUTHORIZED", "Invalid credential!");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Signed out sucessfully."));
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const incommingRefreshToken = req.cookies.refreshToken.trim();
      if (!incommingRefreshToken) {
        throw new ApiError(401, "UNAUTHORIZED", "Credentials not provided!");
      }
      const { newRefreshToken, newAccessToken } =
        await authService.refreshAccessToken(incommingRefreshToken);

      return res
        .status(200)
        .cookie("refreshToken", newRefreshToken, refreshTokenOptions)
        .cookie("accessToken", newAccessToken, accessTokenOptions)
        .json(new ApiResponse(200, null, "Credentials refreshed successfully"));
    } catch (error) {
      res
        .clearCookie("accessToken", accessTokenOptions)
        .clearCookie("refreshToken", refreshTokenOptions);

      throw error;
    }
  }
);
