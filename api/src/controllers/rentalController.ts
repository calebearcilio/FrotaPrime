import { Request, Response } from "express";
import rentalService from "../services/rentalService";

class RentalController {
  async create(req: Request, res: Response) {
    const rental = await rentalService.create(req.user.id, req.body);
    res.status(201).json(rental);
  }

  async list(req: Request, res: Response) {
    const rentals = await rentalService.list(req.user.id);
    res.json(rentals);
  }
}

export default new RentalController();
