import { Router } from "express";
import authRoutes from "./authRoutes";

const routes: Router = Router();

routes.use(authRoutes);

export default routes;
