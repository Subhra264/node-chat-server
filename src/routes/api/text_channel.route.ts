import express, { Request, NextFunction, Response } from 'express';
import TextChannelController from '../../controllers/text_channel.controller';
import authenticate from '../../middlewares/auth.middleware';
import AuthenticatedRequest from '../../utils/interfaces/AuthenticatedRequest';
const Router = express.Router();

Router.post('/textchannel', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await TextChannelController.createTextChannel((req as AuthenticatedRequest), res, next);
        
        res.json({
            type: 'success',
            message: 'text-channel created successfully!'
        })
    } catch(err) {
        next(err);
    }
});

export = Router;