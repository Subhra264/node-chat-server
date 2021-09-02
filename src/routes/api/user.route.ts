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

// GET request handler that Returns all self-messages
Router.get('/messages', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const selfMessages = await UserController.getSelfMessages(req as AuthenticatedRequest);

        res.json({
            type: 'success',
            message: selfMessages
        });
    } catch(err) {
        next(err as HttpError);
    }
});

// POST request handler to save a new self-message
Router.post('/messages', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await UserController.newSelfMessage(req as AuthenticatedRequest);

        res.json({
            type: 'success',
            message: 'Message saved successfully!'
        });
    } catch(err) {
        next(err as HttpError);
    }
});

export = Router;