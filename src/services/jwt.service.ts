import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { UserPresenter } from '../types/dtos/userDtos';

dotenv.config();

export class JWTService {
  private SECRET_KEY = process.env.SECRET_KEY!;
  private SECRET_KEY_REFRESH = process.env.SECRET_KEY_REFRESH!;

  generateAccessToken = (user: UserPresenter): string  => {
    return jwt.sign({ user: user }, this.SECRET_KEY, { expiresIn: "1h" })
  }

  generateRefreshToken = (user: UserPresenter): string => {
    return jwt.sign({ user: user }, this.SECRET_KEY_REFRESH, { expiresIn: "7d" })
  }

  verifyJWT = async (token: string): Promise<any> => {
    return jwt.verify(token, this.SECRET_KEY);
  };

  verifyJWTSecret = async (token: string): Promise<any> => {
    return jwt.verify(token, this.SECRET_KEY_REFRESH);
  };

  decodeJWT = async (token: string): Promise<any> => {
    return jwt.decode(token);
  };
}

