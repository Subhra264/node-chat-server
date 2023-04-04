import { NextFunction, Request, Response } from 'express';
import convertToHttpErrorFrom from '../errors/errorsToHttpError';
import HttpErrors, { HttpError } from '../errors/http-errors';
import { JWT_ERROR_CODE } from '../utils/jwt';
import GRPCAuthClient from '../grpc/GRPCAuthClient';

export interface AuthenticatedRequest extends Request {
  userId: string;
  username: string;
}

export default async function (req: Request, _: Response, next: NextFunction) {
  try {
    let token: string | undefined = req.headers['authorization'];

    if (!token) throw HttpErrors.Unauthorized();
    if (token === 'Bearer') throw HttpErrors.Unauthorized(JWT_ERROR_CODE);
    if (!token.startsWith('Bearer ')) throw HttpErrors.Unauthorized();

    token = token.replace('Bearer ', '');
    const response = await GRPCAuthClient.client.validateToken(token);

    if (!response.userId || !response.username)
      throw new Error('AUTHENTICATION_ERROR');
    // TODO: Add Redis caching

    (req as AuthenticatedRequest).userId = response.userId;
    (req as AuthenticatedRequest).username = response.username;
    next();
  } catch (err) {
    err = convertToHttpErrorFrom(err);
    next(err as HttpError);
  }
}
