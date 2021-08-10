import { Request } from 'express';
import { Document } from 'mongoose';
import { UserDocument } from '../../models/User.model';

// export type AuthenticatedUser = Omit<UserDocument, 'password' | 'refreshToken'>;
type IAuthenticatedCachedUser = Omit<UserDocument, keyof Document | 'validatePassword'>;

export interface AuthenticatedCachedUser extends IAuthenticatedCachedUser {
    _id: any;
    __v: any;
}

export default interface AuthenticatedRequest extends Request {
    user: AuthenticatedCachedUser | UserDocument;
}