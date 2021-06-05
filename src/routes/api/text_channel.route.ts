import express, { Request, NextFunction, Response } from 'express';
import TextChannelController from '../../controllers/text_channel.controller';
import HttpError from '../../errors/HttpError';
import authenticate from '../../middlewares/auth.middleware';
import AuthenticatedRequest from '../../utils/interfaces/AuthenticatedRequest';
const Router = express.Router();

Router.get('/messages', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const messages = await TextChannelController.getMessages((req as AuthenticatedRequest));

        res.json({
            type: 'success',
            message: messages
        })
    } catch(err) {
        next(err as HttpError);
    }
});

Router.post('/', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await TextChannelController.createTextChannel((req as AuthenticatedRequest), res, next);
        
        res.json({
            type: 'success',
            message: 'text-channel created successfully!'
        })
    } catch(err) {
        next(err as HttpError);
    }
});

Router.put('/message', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await TextChannelController.saveMessage((req as AuthenticatedRequest));

        res.json({
            type: 'success',
            message: 'Message saved successfully!'
        });
        
    } catch(err) {
        next(err as HttpError);
    }
});

export = Router;