import { ApiError } from "../ApiError";

export class RentalForbiddenError extends ApiError {
  constructor() {
    super(403, "You do not have permission to finalize this rental");
  }
}