import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/ApiError";

export const globalErrorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  console.log(error);
  return res.status(500).json({
    message: "Internal server error",
  });
};
