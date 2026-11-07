import { ApiError } from "../ApiError";

export class AuthenticationError extends ApiError {
  constructor() {
    super(401, "Invalid email or password");
  }
}
