export abstract class ApiError extends Error {
  constructor(
    readonly statusCode: number,
    public message: string,
  ) {
    super(message);
  }
}
