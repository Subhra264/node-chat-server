import { Request } from 'express';
import User from '../../models/User.model';

export type AuthenticatedUser = Omit<typeof User, 'password' | 'refreshToken'>;

export default interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser;
}