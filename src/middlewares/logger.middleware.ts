import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from "fs";

const logger = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`${req.method} ${req.url}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  const logFilePath = path.join(__dirname, '../logs/logs.txt');
  const logMessage = `${(req as any).decoded?.user ? (req as any).decoded.user.id : 'Not connected'} 
  - ${new Date().toISOString()} 
  - ${req.method} ${req.path}`;
  
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) console.error("Failed to write to log file:", err);
  });
  next();
};

export default logger;
