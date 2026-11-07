import { ApiError } from "../ApiError";

export class UserNotFoundError extends ApiError {
  constructor() {
    super(404, "User not found")
  }
}