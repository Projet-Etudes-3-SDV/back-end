import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { DecodedUser, EncodedRequest } from '../utils/EncodedRequest';
import { UserRole } from '../models/user.model';

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY!;
const SECRET_KEY_REFRESH = process.env.SECRET_KEY_REFRESH!;

export const checkRole = (req: EncodedRequest, res: Response, next: NextFunction): void => {
  const decodedUser = req.decoded as DecodedUser;

  if (!decodedUser || !decodedUser.user.role) {
    return next(new AppError('User role not found', 403));
  }

  if (decodedUser.user.role !== UserRole.ADMIN) {
    return next(new AppError('Forbidden', 403));
  }
  next();
};

export const checkJWT = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next(new AppError('No token provided', 401));
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new AppError('Failed to authenticate token', 401));
    }

    if (!decoded || typeof decoded === 'string') {
      return next(new AppError('Invalid token', 401));
    }
    (req as EncodedRequest).decoded = decoded as DecodedUser;

    if (decoded.user.isValidated === false) {
      return next(new AppError('User is not validated', 403));
    }
    next();
  });
};

export const checkJWTSecret = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return next(new AppError('No token provided', 401));
  }

  jwt.verify(token, SECRET_KEY_REFRESH, (err, decoded) => {
    if (err) {
      return next(new AppError('Failed to authenticate token', 401));
    }

    if (!decoded || typeof decoded === 'string') {
      return next(new AppError('Invalid token', 401));
    }
    (req as EncodedRequest).decoded = decoded as DecodedUser;
    next();
  });
};
