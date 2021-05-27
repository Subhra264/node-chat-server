import { NextFunction, Request, Response } from "express";
import HttpErrors from "../errors/http-errors";
import UserModel from "../models/User.model";
import AuthenticatedRequest from "../utils/interfaces/AuthenticatedRequest";
import { verifyToken } from "../utils/jwt_utils/jwt_utils";

interface Payload extends Object {
    userId: string;
}

export default async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        let token = req.headers['authorization'];

        if (!token) throw HttpErrors.Unauthorized();
        if (!token.startsWith('Bearer ')) throw HttpErrors.Unauthorized();

        token = token.replace('Bearer ', '');
        const payload = await verifyToken(token);

        const user = await UserModel.findById((payload as Payload).userId).exec();

        if (!user) throw HttpErrors.Unauthorized();

        (req as AuthenticatedRequest).user = user;
        next();

    } catch(err) {
        if (!err.isHttpError) {
            err = HttpErrors.ServerError();
        }
        next(err);
    }
}