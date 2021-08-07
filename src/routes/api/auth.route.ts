import express, { Request, Response, NextFunction } from 'express';
import AuthController from '../../controllers/auth.controller';
import HttpError from '../../errors/HttpError';
const Router = express.Router();

Router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {

    try {

        // const accessToken: string = await AuthController.createAccount(req, res, next);
        await AuthController.createAccount(req, res, next);

        res.json({
            type: 'success',
            // message: accessToken
        });
    } catch(err) {
        next(err as HttpError);
    }

});

Router.post('/signin', async (req: Request, res: Response, next: NextFunction) => {

    try {
        const user = await AuthController.authenticateUser(req, res, next);

        res.json({
            type: 'success',
            message: user
        });
    } catch(err) {
        next(err as HttpError);
    }

});

Router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken: string = await AuthController.refreshAccessToken(req, res, next);

        res.json({
            type: 'success',
            message: accessToken
        });
    } catch(err) {
        next(err as HttpError);
    }
})

export = Router;