export abstract class ApiError extends Error {
  constructor(
    readonly statusCode: number,
    public message: string,
  ) {
    super(message);

    // Correção para 'instanceof' funcionar corretamente
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
