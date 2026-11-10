import { NextFunction, Request, Response } from "express";
import z, { ZodError } from "zod";

export const bodyValidate =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed;
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        if (error.issues)
          return res.status(400).json({
            message: "Invalid body data",
            errors: error.issues.map((err) => ({
              field: err.path[0],
              description: err.message,
            })),
          });
      }

      next(error);
    }
  };

export const queryValidate =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          message: "Invalid query data",
          errors: error.issues.map((err) => ({
            field: err.path[0],
            description: err.message,
          })),
        });
      }

      next(error);
    }
  };
