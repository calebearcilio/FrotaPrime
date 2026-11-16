import { ApiError } from "../ApiError";

export class VehicleAlreadyExistsError extends ApiError {
  constructor() {
    super(409, "Veículo já cadastrado");
  }
}