import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction): void => {
  console.log(`${req.method} ${req.url}`);
  console.log(`Body: ${JSON.stringify(req.body)}`);
  next();
};

export default logger;
