import { ApiError } from "../ApiError";

export class PasswordsNotMatchError extends ApiError {
  constructor() {
    super(422, "Senhas não coincidem");
  }
}
