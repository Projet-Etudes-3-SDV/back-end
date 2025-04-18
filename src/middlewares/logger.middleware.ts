import { Response, NextFunction } from 'express';
import path from 'path';
import fs from "fs";
import { EncodedRequest } from '../utils/EncodedRequest';

const logger = (req: EncodedRequest, res: Response, next: NextFunction): void => {
  console.log(`${req.method} ${req.url}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  const logFilePath = path.join(__dirname, '../logs/logs.txt');
  const logMessage = `${req.decoded?.user ? req.decoded.user.id : 'Not connected'} 
  - ${new Date().toISOString()} 
  - ${req.method} ${req.path}\n`;
  
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) console.error("Failed to write to log file:", err);
  });
  next();
};

export default logger;
