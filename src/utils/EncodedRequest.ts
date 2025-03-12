import { Request } from 'express';
import { IUser } from '../models/user.model';
import { JwtPayload } from 'jsonwebtoken';

export interface DecodedUser {
    user: IUser
}

export interface EncodedRequest extends Request {
    decoded: DecodedUser
}

export interface EncodedPayload extends JwtPayload {
    decoded: DecodedUser  
}