import { Router } from "express";
import authRoutes from "./authRoutes";
import rentalRoutes from "./rentalRoutes";
import vehicleRoutes from "./vehicleRoutes";

const routes: Router = Router();

routes.use(authRoutes);
routes.use(vehicleRoutes);
routes.use(rentalRoutes);

export default routes;
