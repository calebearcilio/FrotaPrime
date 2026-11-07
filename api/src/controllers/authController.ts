import { Request, Response } from "express";
import { ApiError } from "../errors/ApiError";
import authService from "../services/authService";

class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const authData = await authService.login({ email, password });

      res.status(200).json(authData);
    } catch (error: any) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      }

      res.status(500).json({ message: "Internal error", error: error });
    }
  }

  async signup(req: Request, res: Response) {
    try {
      const body = req.body;
      const authData = await authService.signup(body);

      res.status(201).json(authData);
    } catch (error: any) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ message: error.message });
      }

      res.status(500).json({ message: "Internal error", error: error });
    }
  }
}

export default new AuthController();
