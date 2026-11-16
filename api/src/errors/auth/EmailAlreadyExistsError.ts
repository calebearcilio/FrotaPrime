import { ApiError } from "../ApiError";

export class EmailAlreadyExistsError extends ApiError {
  constructor() {
    super(409, "E-mail já está cadastrado");
  }
}
