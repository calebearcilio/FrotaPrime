import { Router } from "express";
import vehicleController from "../controllers/vehicleController";
import { authValidate } from "../middlewares/authValidation";
import { bodyValidate, queryValidate } from "../middlewares/schemaValidation";
import {
  createVehicleSchema,
  listVehiclesQuerySchema,
} from "../schemas/vehicleSchema";

const vehicleRoutes: Router = Router();

vehicleRoutes.post(
  "/veiculos",
  authValidate,
  bodyValidate(createVehicleSchema),
  vehicleController.create,
);

vehicleRoutes.get(
  "/veiculos",
  authValidate,
  queryValidate(listVehiclesQuerySchema),
  vehicleController.list,
);

export default vehicleRoutes;