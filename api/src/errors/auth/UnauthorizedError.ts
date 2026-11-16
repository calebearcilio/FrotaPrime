import { ApiError } from "../ApiError";

export class UnauthorizedError extends ApiError {
  constructor(message = "Operação não autorizada") {
    super(401, message);
  }
}
