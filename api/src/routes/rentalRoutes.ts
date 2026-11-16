import { Router } from "express";
import rentalController from "../controllers/rentalController";
import { authValidate } from "../middlewares/authValidation";
import { bodyValidate } from "../middlewares/schemaValidation";
import { createRentalSchema } from "../schemas/rentalSchema";

const rentalRoutes: Router = Router();

rentalRoutes.get("/locacoes", authValidate, rentalController.list);
rentalRoutes.post(
  "/locacoes",
  authValidate,
  bodyValidate(createRentalSchema),
  rentalController.create,
);
rentalRoutes.patch(
  "/locacoes/:id/finalizar",
  authValidate,
  rentalController.finalize,
);

export default rentalRoutes;
