import { ApiError } from "../ApiError";

export class VehicleUnavailableError extends ApiError {
  constructor() {
    super(409, "Vehicle is not available");
  }
}
