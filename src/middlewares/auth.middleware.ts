import { NextFunction, Request, Response } from "express";
import convertToHttpErrorFrom from "../errors/errors_to_HttpError";
import HttpErrors from "../errors/http-errors";
import HttpError from "../errors/HttpError";
import User, { UserDocument } from "../models/User.model";
import AuthenticatedRequest from "../utils/interfaces/AuthenticatedRequest";
import { verifyToken } from "../utils/jwt_utils/jwt_utils";

interface Payload {
    userId: string;
}

export default async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        let token: string | undefined = req.headers['authorization'];

        if (!token) throw HttpErrors.Unauthorized();
        if (!token.startsWith('Bearer ')) throw HttpErrors.Unauthorized();

        token = token.replace('Bearer ', '');
        const payload = await verifyToken(token);

        const user: UserDocument = await User.findById((payload as unknown as Payload).userId).exec();

        if (!user) throw HttpErrors.Unauthorized();

        (req as AuthenticatedRequest).user = user;
        next();

    } catch(err) {
        err = convertToHttpErrorFrom(err);
        next(err as HttpError);
    }
}