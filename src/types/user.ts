import type { Document, Types } from "mongoose";
import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

interface UserMethods {
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface UserSchema extends Document, UserMethods {
  username: string;
  email: string;
  refreshToken: string;
}

export interface UserRequest extends Request {
  user: {
    _id: string | Types.ObjectId;
    username: string;
    email: string;
  };
}

export interface DecodedAcceessToken extends JwtPayload {
  _id: string;
  email: string;
  username: string;
  tokenType: string;
}

export interface DecodedRefreshToken extends JwtPayload {
  _id: string;
  tokenType: string;
}
