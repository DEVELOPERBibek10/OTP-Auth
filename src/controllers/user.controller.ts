import type { AuthRequest } from "../types/user.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import type { Response } from "express";

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  const user = req.user;
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched sucessfully!"));
};
