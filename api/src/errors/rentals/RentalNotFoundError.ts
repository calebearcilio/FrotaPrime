import { ApiError } from "../ApiError";

export class RentalNotFoundError extends ApiError {
  constructor() {
    super(404, "Rental not found");
  }
}