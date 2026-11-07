import { ApiError } from "../ApiError";

export class PasswordsNotMatchError extends ApiError {
  constructor(){
    super(0, "Passwords do not match");
  }
}