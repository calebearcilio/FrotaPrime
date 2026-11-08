import { ApiError } from "../ApiError";

export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized operation") {
    super(401, message);
  }
}
