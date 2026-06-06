import type { DecodedAcceessToken, UserRequest } from "../types/user.js";
import type { NextFunction, Response } from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(
  async (req: UserRequest, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "UNAUTHORIZED", "Unauthorized request.");
    }

    try {
      const decodedToken: DecodedAcceessToken = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET!
      ) as DecodedAcceessToken;

      const user = await User.findById(decodedToken._id);

      if (!user) {
        throw new ApiError(404, "NOT_FOUND", "User does not exist.");
      }
      req.user = user;
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(
          401,
          "REFRESH_TOKEN_EXPIRED",
          "Session expired, please login again"
        );
      }
      if (error instanceof jwt.JsonWebTokenError) {
        console.log("Cookie cleared: Malformed refresh token");
        throw new ApiError(401, "INVALID_TOKEN", "Refresh token is malformed.");
      }
      throw error;
    }
  }
);
