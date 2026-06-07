import type { Error as MongooseError } from "mongoose";
export interface ApiError extends Error {
  statusCode: number;
  code: string;
  errors?: string[];
  success: boolean;
  stack?: string;
}
export type GlobalError =
  | ApiError
  | MongooseError.ValidationError
  | MongooseError.CastError
  | SyntaxError
  | Error
  | any;
