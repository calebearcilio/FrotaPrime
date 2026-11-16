import { ApiError } from "../ApiError";

export class RentalForbiddenError extends ApiError {
  constructor() {
    super(403, "Você não tem permissão para finalizar esta locação");
  }
}