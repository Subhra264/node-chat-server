import { Request } from 'express';
import { UserDocument } from '../../models/User.model';

export type AuthenticatedUser = Omit<UserDocument, 'password' | 'refreshToken'>;

export default interface AuthenticatedRequest extends Request {
    user: AuthenticatedUser;
}