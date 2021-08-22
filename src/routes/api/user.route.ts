import express, { NextFunction, Request, Response } from 'express';
import authenticate from '../../middlewares/auth.middleware';
import HttpError from '../../errors/HttpError';
import AuthenticatedRequest from '../../utils/interfaces/AuthenticatedRequest';
import UserController from '../../controllers/user.controller';
const Router = express.Router();

Router.get('/friends', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userFriends = await UserController.getFriendList(req as AuthenticatedRequest);

        res.json({
            type: 'success',
            message: userFriends
        });
    } catch(err) {
        next(err as HttpError);
    }
});

Router.get('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userProfile = await UserController.getProfileData(req as AuthenticatedRequest);

        res.json({
            type: 'success',
            message: userProfile
        });
    } catch(err) {
        next(err as HttpError);
    }
});

export = Router;