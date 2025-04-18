import { Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import path from 'path';
import fs from "fs";
import { EncodedRequest } from '../utils/EncodedRequest';

export const errorHandler = (err: Error, req: EncodedRequest, res: Response, next: NextFunction) => {
    const logFilePath = path.join(__dirname, '../logs/errors.txt');
    const logMessage = `${req.decoded?.user ? req.decoded.user.id : 'Not connected'} - ${req.ip} 
    - ${new Date().toISOString()} 
    - ${req.method} ${req.path} 
    - ${err instanceof AppError ? err.statusCode : 500} 
    - ${err.message || "An unexpected error occurred"}
    - ${err instanceof AppError ? err.code : ""}\n
    `;
    
    fs.appendFile(logFilePath, logMessage, (err) => {
      if (err) console.error("Failed to write to log file:", err);
    });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
      details: err.details,
      code: err.code
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
