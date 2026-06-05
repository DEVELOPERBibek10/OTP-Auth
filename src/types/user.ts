import type { Request } from "express";
import type { Document } from "mongoose";
export interface User extends Request {
  body: {
    username: string;
    email: string;
  };
}

interface UserMethods {
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

export interface UserSchema extends Document, UserMethods {
  username: string;
  email: string;
  refreshToken: string;
}
