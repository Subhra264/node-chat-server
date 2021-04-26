import HttpErrors from "../errors/http-errors";
import User from "../models/User.model";
import userSchema from "../utils/validate_schema/validate_user"
import { Request, Response } from 'express';
import { Document } from "mongoose";
import hashPassword from '../utils/encryption_utils/hash_password';

export = {
    createAccount: async (req: Request, res: Response) => {

        try {
            // Validate the req.body
            const validatedUser = await userSchema.validateAsync(req.body);

            const doesExist = await User.findOne({
                email: validatedUser.email
            });

            if(doesExist) throw await HttpErrors.Conflict('User already exists!');

            const hashedPassword: string = await hashPassword(validatedUser.password);

            const user: Document = new User({
                ...validatedUser,
                password: hashedPassword
            });
            await user.save();

        } catch(err) {
            // TODO: Create a Error Converter that converts errors to HttpErrors
            if(err.isJoi) {
                err = await HttpErrors.BadRequest('Please fill all the fields properly!');
            }
            throw err;
        }
    },

    authenticateUser: async (req: Request, res: Response) => {
        const {email, password} = req.body;

        
    }
}