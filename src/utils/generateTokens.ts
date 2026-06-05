import type { Types } from "mongoose";
import { User } from "../models/user.model.js";
import ApiError from "./ApiError.js";

export const generateAccessAndRefreshToken = async (
  userId: string | Types.ObjectId
) => {
  try {
    const user = await User.findById(userId)!;
    const accessToken = user!.generateAccessToken();
    const refreshToken = user!.generateRefreshToken();

    user!.refreshToken = refreshToken;
    await user!.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Unexpected error (generate token): ", error);
    throw new ApiError(
      500,
      "INTERNAL_SERVER_ERROR",
      "Unable to generate refresh and access token !"
    );
  }
};
