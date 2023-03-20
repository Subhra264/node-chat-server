import HttpErrors from '../errors/http-errors';
import UserSchema from '../utils/UserSchema';
import UserSchema_Joi from '../utils/validateUser';
import { Request, Response } from 'express';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import {
  signJWTToken,
  verifyToken,
  UserPayload,
  TokenKeyType,
} from '../utils/jwt';
import convertToHttpErrorFrom from '../errors/errorsToHttpError';
import PrismaORM from '../init/init.prisma';

interface AuthenticatedUser {
  accessToken: string;
  userId: any;
  username: string;
}

interface AuthenticatedUserRefresh extends AuthenticatedUser {
  refreshToken: string;
}

const prisma = PrismaORM.get();

export default {
  // Called when an user signs up
  createAccount: async (req: Request): Promise<void> => {
    try {
      // Validate the req.body
      const validatedUser: UserSchema = await UserSchema_Joi.validateAsync(
        req.body,
      );

      const existingUser = await prisma.user.findMany({
        where: {
          OR: [
            { email: validatedUser.email },
            { username: validatedUser.username },
          ],
        },
      });

      if (existingUser.length)
        throw HttpErrors.Conflict('User already exists!');
      const hashedPassword: string = await hashPassword(validatedUser.password);

      await prisma.user.create({
        data: {
          ...validatedUser,
          password: hashedPassword,
        },
      });
    } catch (err) {
      console.log('Error creating new user: ', (err as Error).message);
      throw convertToHttpErrorFrom(err);
    }
  },

  // Called when an user logs in
  authenticateUser: async (req: Request): Promise<AuthenticatedUserRefresh> => {
    try {
      const validatedUser: UserSchema = await UserSchema_Joi.validateAsync(
        req.body,
      );
      const user = await prisma.user.findUnique({
        where: {
          email: validatedUser.email,
        },
      });

      if (!user) throw HttpErrors.Unauthorized('email/password not valid!');

      const matchedPassword: boolean = await comparePassword(
        validatedUser.password,
        user.password,
      );
      if (!matchedPassword)
        throw HttpErrors.Unauthorized('email/password not valid!');

      const userPayload: UserPayload = {
        userId: user.id,
        username: user.username,
      };

      const accessToken: string = await signJWTToken(
        userPayload,
        TokenKeyType.JWT_ACCESS_KEY,
      );
      const refreshToken: string = await signJWTToken(
        userPayload,
        TokenKeyType.JWT_REFRESH_KEY,
      );

      return {
        accessToken,
        refreshToken,
        userId: user.id,
        username: user.username,
      };
    } catch (err) {
      throw convertToHttpErrorFrom(err);
    }
  },

  // Called when user requests for a new access-token
  refreshAccessToken: async (req: Request): Promise<AuthenticatedUser> => {
    try {
      // User must send the refresh token as http-only cookie
      if (!req.headers.cookie)
        throw HttpErrors.Unauthorized('Refresh Token not valid!');

      const cookies: string[] = req.headers.cookie.split('; ');
      let refreshToken = '';

      for (const cookie of cookies) {
        if (cookie.startsWith('refreshToken')) {
          refreshToken = cookie.slice(cookie.indexOf('=') + 1);
        }
      }

      // If refreshToken is not present in the cookie, throw Unauthorized error
      if (!refreshToken)
        throw HttpErrors.Unauthorized('Refresh Token not valid!');

      const userPayload = (await verifyToken(
        refreshToken,
        TokenKeyType.JWT_REFRESH_KEY,
      )) as unknown as UserPayload;
      if (!userPayload.userId || !userPayload.username)
        throw HttpErrors.Unauthorized('Refresh Token not valid!');

      const accessToken: string = await signJWTToken(
        userPayload,
        TokenKeyType.JWT_ACCESS_KEY,
      );
      return {
        ...userPayload,
        accessToken,
      };
    } catch (err) {
      throw convertToHttpErrorFrom(err);
    }
  },
};
