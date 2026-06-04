import type { Request } from "express";
export interface User extends Request {
  body: {
    username: string;
    email: string;
  };
}
