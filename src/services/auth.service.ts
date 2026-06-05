import type { SentMessageInfo } from "nodemailer/lib/sendmail-transport/index.js";
import { User } from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import emailService from "./email.service.js";
import otpService from "./otp.service.js";
import { generateAccessAndRefreshToken } from "../utils/generateTokens.js";

interface CompleteSignInOrUp {
  accessToken: string;
  refreshToken: string;
  user: {
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

    return { accessToken, refreshToken, user: { email, username } };
  }

  async initiateSignIn(email: string): Promise<SentMessageInfo> {
    const existingUser = await User.exists({
      email,
    });

    if (!existingUser) {
      throw new ApiError(
        404,
        "USER_NOT_FOUND",
        "User with this email does not exist."
      );
    }

    const otp = await otpService.setOTP(email);
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

    return { accessToken, refreshToken, user: { email, username } };
  }
  async refreshAccessToken(refreshToken: string) {}
}

const authService = new AuthService();
export default authService;
