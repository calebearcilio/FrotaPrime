import { ApiError } from "../ApiError";

export class VehicleNotFoundError extends ApiError {
  constructor() {
    super(404, "Vehicle not found");
  }
}
