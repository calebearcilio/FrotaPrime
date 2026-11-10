import { Request, Response } from "express";
import vehicleService from "../services/vehicleService";

class VehicleController {
  async create(req: Request, res: Response) {
    const vehicle = await vehicleService.create(req.body);
    res.status(201).json(vehicle);
  }

  async list(req: Request, res: Response) {
    const availableQuery = req.query.disponivel;
    const available =
      availableQuery === undefined ? undefined : availableQuery === "true";

    const vehicles = await vehicleService.list(available);
    res.status(200).json(vehicles);
  }
}

export default new VehicleController();