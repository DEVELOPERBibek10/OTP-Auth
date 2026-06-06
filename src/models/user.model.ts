import { model, Schema } from "mongoose";
import jwt, { type Secret } from "jsonwebtoken";
import type { UserSchema } from "../types/user.js";

const userSchema = new Schema<UserSchema>(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: false }
);

userSchema.index({ username: 1, email: 1 }, { unique: true });

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      token_type: "access",
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY! as any,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      token_type: "refresh",
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY! as any,
    }
  );
};

export const User = model<UserSchema>("User", userSchema);
