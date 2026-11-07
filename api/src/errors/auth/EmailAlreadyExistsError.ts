import { ApiError } from "../ApiError";

export class EmailAlreadyExistsError extends ApiError {
  constructor() {
    super(409, "Email is already registered");
  }
}
