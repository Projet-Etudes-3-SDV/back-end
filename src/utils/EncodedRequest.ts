import { Request } from 'express';
import { UserRole } from '../models/user.model';

export interface DecodedUser {
    user: {
        _id: string;
        email: string;
        role: UserRole;
    };
}

export interface EncodedRequest extends Request {
    decoded: DecodedUser
}