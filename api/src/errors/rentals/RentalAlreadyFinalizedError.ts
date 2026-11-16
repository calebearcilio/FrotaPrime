import { ApiError } from "../ApiError";

export class RentalAlreadyFinalizedError extends ApiError {
  constructor() {
    super(409, "Rental is already finalized");
  }
}