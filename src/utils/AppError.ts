export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: details[];
  code?: string;

  constructor(message: string, statusCode: number,  details?: details[], code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export interface details {
    field: string;
    constraints: string[];
}