import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.log({error: error})
  return res.status(500).json({
    message: "Internal server error"
  })
}