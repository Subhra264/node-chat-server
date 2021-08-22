import HttpErrors from "../errors/http-errors";
import User, { UserDocument, UserSchema } from "../models/User.model";
import UserSchema_Joi from "../utils/validate_schema/validate_user"
import { NextFunction, Request, Response } from 'express';
import { hashPassword } from '../utils/encryption_utils/bcrypt_utils';
import { signJWTToken, verifyToken } from '../utils/jwt_utils/jwt_utils';
import convertToHttpErrorFrom from "../errors/errors_to_HttpError";
import { UserPayload, TokenType } from "../utils/interfaces/JWTUtils";

export default {
    // Called when an user signs up
    createAccount: async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            // Validate the req.body
            const validatedUser: UserSchema = await UserSchema_Joi.validateAsync(req.body);

            const existingUser: UserDocument = await User.findOne({
                email: validatedUser.email
            }).exec();

            if (existingUser) throw HttpErrors.Conflict('User already exists!');

            const hashedPassword: string = await hashPassword(validatedUser.password);

            const user: UserDocument = new User({
                ...validatedUser,
                password: hashedPassword
            });
            await user.save();

        } catch(err) {
            throw convertToHttpErrorFrom(err);
        }
    },

    // Called when an user logs in
    authenticateUser: async (req: Request, res: Response, next: NextFunction): Promise<any> => {

        try {
            const validatedUser: UserSchema = await UserSchema_Joi.validateAsync(req.body);
            const user: UserDocument = await User.findOne({
                email: validatedUser.email
            }).exec();

            if (!user) throw HttpErrors.Unauthorized('email/password not valid!');

            const matchedPassword: boolean = await user.validatePassword(validatedUser.password);
            if (!matchedPassword) throw HttpErrors.Unauthorized('email/password not valid!');

            const userPayload: UserPayload = {
                userId: user.id,
                username: user.username
            }

            const accessToken: string = await signJWTToken(userPayload, TokenType.ACCESS_TOKEN);
            const refreshToken: string = await signJWTToken(userPayload, TokenType.REFRESH_TOKEN);

            // Send back the refreshToken as a httponly cookie
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 15*24*60*60*1000
            });

            return {
                accessToken,
                // refreshToken,
                userId: user._id,
                username: user.username
            };

        } catch(err) {
            throw convertToHttpErrorFrom(err);
        }
        
    },

    // Called when user requests for a new access-token
    refreshAccessToken: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        
        try {
            // User must send the refresh token as http-only cookie
            if (!req.headers.cookie) throw HttpErrors.Unauthorized('Refresh Token not valid!');

            const cookies: string[] = req.headers.cookie.split('; ');
            let refreshToken: string = '';

            for (const cookie of cookies) {
                if (cookie.startsWith('refreshToken')) {
                    refreshToken = cookie.slice(cookie.indexOf('=') + 1);
                }
            }

            // If refreshToken is not present in the cookie, throw Unauthorized error
            if (!refreshToken) throw HttpErrors.Unauthorized('Refresh Token not valid!');

            const { userId, username } = (await verifyToken(refreshToken, TokenType.REFRESH_TOKEN)) as unknown as UserPayload;
            if (!userId || !username) throw HttpErrors.Unauthorized('Refresh Token not valid!');

            const accessToken: string = await signJWTToken({ userId, username }, TokenType.ACCESS_TOKEN);
            return {
                userId,
                username,
                accessToken
            };
        } catch(err) {
            throw convertToHttpErrorFrom(err);
        }
    }
}