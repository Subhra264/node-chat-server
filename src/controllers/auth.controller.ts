import HttpErrors from "../errors/http-errors";
import User, { UserDocument, UserSchema } from "../models/User.model";
import UserSchema_Joi from "../utils/validate_schema/validate_user"
import { NextFunction, Request, Response } from 'express';
import { hashPassword } from '../utils/encryption_utils/bcrypt_utils';
import { signAccessToken } from '../utils/jwt_utils/jwt_utils';
import convertToHttpErrorFrom from "../errors/errors_to_HttpError";

export default {
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

    authenticateUser: async (req: Request, res: Response, next: NextFunction): Promise<string> => {

        try {
            const validatedUser: UserSchema = await UserSchema_Joi.validateAsync(req.body);
            const user: UserDocument = await User.findOne({
                email: validatedUser.email
            }).exec();

            if (!user) throw HttpErrors.Unauthorized('email/password not valid!');

            const matchedPassword: boolean = await user.validatePassword(validatedUser.password);
            if (!matchedPassword) throw HttpErrors.Unauthorized('email/password not valid!');

            const accessToken: string = await signAccessToken(user.id);

            return accessToken;

        } catch(err) {
            throw convertToHttpErrorFrom(err);
        }
        
    }
}