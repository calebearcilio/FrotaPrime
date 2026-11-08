import { Request, Response } from "express";
import authService from "../services/authService";

class AuthController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const authData = await authService.login({ email, password });

    res.status(200).json(authData);
  }

  async signup(req: Request, res: Response) {
    const body = req.body;
    const authData = await authService.signup(body);

    res.status(201).json(authData);
  }
}

export default new AuthController();
