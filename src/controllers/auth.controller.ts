import HttpErrors from "../errors/http-errors";
import User from "../models/User.model";
import userSchema from "../utils/validate_schema/validate_user"
import { NextFunction, Request, Response } from 'express';
import { Document } from "mongoose";
import { hashPassword } from '../utils/encryption_utils/bcrypt_utils';
import { signAccessToken } from '../utils/jwt_utils/jwt_utils';

export default {
    createAccount: async (req: Request, res: Response, next: NextFunction): Promise<void> => {

        try {
            // Validate the req.body
            const validatedUser = await userSchema.validateAsync(req.body);

            const doesExist = await User.findOne({
                email: validatedUser.email
            });

            if (doesExist) throw HttpErrors.Conflict('User already exists!');

            const hashedPassword: string = await hashPassword(validatedUser.password);

            const user: Document = new User({
                ...validatedUser,
                password: hashedPassword
            });
            await user.save();

        } catch(err) {
            // TODO: Create a Error Converter that converts errors to HttpErrors
            if (err.isJoi) {
                err = HttpErrors.BadRequest(err.message);
            }

            if (!err.isHttpError) {
                err = HttpErrors.BadRequest(err.message);
            }

            throw err;
        }
    },

    authenticateUser: async (req: Request, res: Response, next: NextFunction): Promise<string> => {

        try {
            const validatedUser = await userSchema.validateAsync(req.body);
            const user = await User.findOne({
                email: validatedUser.email
            });

            if (!user) throw HttpErrors.Unauthorized('email/password not valid!');

            const matchedPassword: boolean = await user.validatePassword();
            if (!matchedPassword) throw HttpErrors.Unauthorized('email/password not valid!');

            const accessToken: string = await signAccessToken(user.id);

            return accessToken;

        } catch(err) {
            // Joi Errors must be converted to HttpErrors
            if (err.isJoi) {
                err = HttpErrors.BadRequest(err.message);
            }
            throw err;
        }
        
    }
}