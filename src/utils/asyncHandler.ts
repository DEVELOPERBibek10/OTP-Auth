import type { NextFunction, Request, RequestHandler, Response } from "express";

type AsyncRequestHandler<T = Request> = (
  req: T,
  res: Response,
  next: NextFunction
) => Promise<Response> | Promise<void> | void;

const asyncHandler = <T = Request>(
  requestHandler: AsyncRequestHandler<T>
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req as T, res, next)).catch((err) =>
      next(err)
    );
  };
};

export default asyncHandler;
