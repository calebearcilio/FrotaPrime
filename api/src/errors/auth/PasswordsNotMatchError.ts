import { ApiError } from "../ApiError";

export class PasswordsNotMatchError extends ApiError {
  constructor() {
    super(422, "Passwords do not match");
  }
}
