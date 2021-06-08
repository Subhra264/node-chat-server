import { NextFunction, Request, Response } from "express";
import convertToHttpErrorFrom from "../errors/errors_to_HttpError";
import HttpErrors from "../errors/http-errors";
import HttpError from "../errors/HttpError";
import User, { UserDocument } from "../models/User.model";
import AuthenticatedRequest from "../utils/interfaces/AuthenticatedRequest";
import { verifyToken } from "../utils/jwt_utils/jwt_utils";
import * as RedisClient from '../utils/redis_utils/redis_utils';

interface Payload {
    userId: string;
}

export default async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        let token: string | undefined = req.headers['authorization'];

        if (!token) throw HttpErrors.Unauthorized();
        if (!token.startsWith('Bearer ')) throw HttpErrors.Unauthorized();

        token = token.replace('Bearer ', '');
        const payload = (await verifyToken(token)) as unknown as Payload;

        // Check in the cache first
        let user = (await RedisClient.get(payload.userId, { json: true })) as UserDocument | null;

        if (!user) {
            // Then check in the database
            // TODO: Rethink over the implementation logic
            user = await User.findById(payload.userId)
                .populate('groups', 'name image')
                .exec();
            if (!user) throw HttpErrors.Unauthorized();

            // TODO: Set a separate setex time for dev(300s) and prod(3600s)
            // Don't use await here
            RedisClient.setex(payload.userId, user, 3600, { json: true });
        }

        (req as AuthenticatedRequest).user = user;
        next();

    } catch(err) {
        err = convertToHttpErrorFrom(err);
        next(err as HttpError);
    }
}