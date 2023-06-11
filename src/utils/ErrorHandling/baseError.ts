export class BaseError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(
    name: string,
    statusCode: number,
    isOperational: boolean,
    description: string
  ) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.message = name;
    Error.captureStackTrace(this);
  }
}
