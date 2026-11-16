import { Request, Response } from "express";
import rentalService from "../services/rentalService";

class RentalController {
  async create(req: Request, res: Response) {
    const rental = await rentalService.create(req.user.id, req.body);
    res.status(201).json(rental);
  }

  async finalize(req: Request, res: Response) {
    const rental = await rentalService.finalize(
      req.user.id,
      Number(req.params.id),
    );
    res.json(rental);
  }
}

export default new RentalController();
