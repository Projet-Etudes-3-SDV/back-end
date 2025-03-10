import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
      details: err.details
    });
  }

  console.error('ERROR', err);
  return res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'An unexpected error occurred'
  });
};
