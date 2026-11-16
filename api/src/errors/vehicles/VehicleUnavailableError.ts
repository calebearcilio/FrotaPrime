import { ApiError } from "../ApiError";

export class VehicleUnavailableError extends ApiError {
  constructor() {
    super(409, "Veículo indisponível para locação");
  }
}
