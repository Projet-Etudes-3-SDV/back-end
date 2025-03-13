import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import path from 'path';
import fs from "fs";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const logFilePath = path.join(__dirname, '../logs/errors.txt');
    const logMessage = `${(req as any).decoded?.user ? (req as any).decoded.user.id : 'Not connected'} 
    - ${new Date().toISOString()} 
    - ${req.method} ${req.path} 
    - ${err instanceof AppError ? err.statusCode : 500} 
    - ${err.message || "An unexpected error occurred"}\n`;
    
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) console.error("Failed to write to log file:", err);
    });

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

  

  next();
};
