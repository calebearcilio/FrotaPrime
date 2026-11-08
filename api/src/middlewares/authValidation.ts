import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/auth/UnauthorizedError";
import { TokenPayload } from "../types/TokenPayload";

const JWT_SECRET = process.env.JWT_SECRET!;

export const authValidate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const headers = req.headers.authorization;

  if (!headers?.startsWith("Bearer ")) throw new UnauthorizedError();

  const token = headers.split(" ")[1];

  if (!token) throw new UnauthorizedError();

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    req.user = decoded;
    next();
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
};
