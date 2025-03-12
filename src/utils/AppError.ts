export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: details[];

  constructor(message: string, statusCode: number,  details?: details[]) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

export interface details {
    field: string;
    constraints: string[];
}