import { Router } from "express";
import authController from "../controllers/authController";
import { bodyValidate } from "../middlewares/schemaValidation";
import { loginSchema, signupSchema } from "../schemas/authSchema";

const authRoutes: Router = Router();

/// Login
authRoutes.post("/auth/login", bodyValidate(loginSchema), authController.login);

/// Signup
authRoutes.post("/auth/signup", bodyValidate(signupSchema), authController.signup);

export default authRoutes;