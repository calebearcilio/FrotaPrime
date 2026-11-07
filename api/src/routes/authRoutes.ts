import { Router } from "express";
import authController from "../controllers/authController";

const authRoutes: Router = Router();

/// Login
authRoutes.post("/auth/login", authController.login);

/// Signup
authRoutes.post("/auth/signup", authController.signup);

export default authRoutes;