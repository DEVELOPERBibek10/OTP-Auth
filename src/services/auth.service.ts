import type { SentMessageInfo } from "nodemailer/lib/sendmail-transport/index.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import emailService from "./email.service.js";
import otpService from "./otp.service.js";
import { generateAccessAndRefreshToken } from "../utils/generateTokens.js";
import type { DecodedRefreshToken } from "../types/user.js";
import jwt from "jsonwebtoken";
import type { Types } from "mongoose";

interface CompleteSignInOrUp {
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string | Types.ObjectId;
    email: string;
    username: string;
  };
}

class AuthService {
  async initiateSignUp(
    username: string,
    email: string
  ): Promise<SentMessageInfo> {
    const existingUser = await User.exists({
      email,
    });

    if (existingUser) {
      throw new ApiError(
        409,
        "ALREADY_EXISTS",
        "A user with this email already exists."
      );
    }

    const otp = await otpService.setOTP(email, username);
    const emailInfo = await emailService.sendOTP(email, otp);

    return emailInfo;
  }

  async completeSignUp(
    email: string,
    otp: number
  ): Promise<CompleteSignInOrUp> {
    const { success, username } = await otpService.verifyOTP(email, otp);
    if (!success) {
      throw new ApiError(
        400,
        "INVALID_OR_EXPIRED_OTP",
        "Invalid or expired verification code."
      );
    }

    const newUser = await User.create({
      username,
      email,
    });

    if (!newUser) {
      throw new ApiError(
        500,
        "INTERNAL_SERVER_ERROR",
        "Failed to register user"
      );
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      newUser._id
    );

    return {
      accessToken,
      refreshToken,
      user: {
        _id: newUser._id,
        email: newUser.email,
        username: newUser.username,
      },
    };
  }

  async initiateSignIn(email: string): Promise<SentMessageInfo> {
    const existingUser = await User.findOne({
      email,
    });

    if (!existingUser) {
      throw new ApiError(
        404,
        "USER_NOT_FOUND",
        "User with this email does not exist."
      );
    }

    const otp = await otpService.setOTP(email, existingUser.username);
    const emailInfo = await emailService.sendOTP(email, otp);

    return emailInfo;
  }

  async completeSignIn(
    email: string,
    otp: number
  ): Promise<CompleteSignInOrUp> {
    const { success, username } = await otpService.verifyOTP(email, otp);
    if (!success) {
      throw new ApiError(
        400,
        "INVALID_OR_EXPIRED_OTP",
        "Invalid or expired verification code."
      );
    }

    const user = await User.exists({
      email,
    });

    if (!user) {
      throw new ApiError(
        404,
        "USER_NOT_FOUND",
        "User with this email does not exist."
      );
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return {
      accessToken,
      refreshToken,
      user: { _id: user._id, email, username },
    };
  }

  async signOut(refreshToken: string) {
    const user = await User.findOneAndUpdate(
      { refreshToken: refreshToken },
      { $unset: { refreshToken: 1 } },
      { new: true }
    );
    return user;
  }

  async refreshAccessToken(
    refreshToken: string
  ): Promise<{ newRefreshToken: string; newAccessToken: string }> {
    let decodedToken: DecodedRefreshToken;
    try {
      decodedToken = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!
      ) as DecodedRefreshToken;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new ApiError(
          401,
          "UNAUTHORIZED",
          "Session expired, please login again"
        );
      }
      if (error instanceof jwt.JsonWebTokenError) {
        console.log("Cookie cleared: Malformed refresh token");
        throw new ApiError(401, "UNAUTHORIZED", "Malformed credentials!.");
      }
      throw error;
    }
    const user = await User.findById(decodedToken._id).select("+refreshToken");
    if (!user) {
      throw new ApiError(404, "NOT_FOUND", "User does not exist.");
    }

    if (refreshToken !== user.refreshToken) {
      throw new ApiError(
        401,
        "UNAUTHORISED",
        "Logged out due to invalid credentials!"
      );
    }

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return { newAccessToken, newRefreshToken };
  }
}

const authService = new AuthService();
export default authService;
