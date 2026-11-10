import { Router } from "express";
import authRoutes from "./authRoutes";
import vehicleRoutes from "./vehicleRoutes";

const routes: Router = Router();

routes.use(authRoutes);
routes.use(vehicleRoutes);

export default routes;
