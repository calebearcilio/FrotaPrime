import { ApiError } from "../ApiError";

export class InvalidCredentialsError extends ApiError {
  constructor() {
    super(401, "E-mail ou senha inválidos");
  }
}
