import express, { Request, Response, NextFunction } from 'express';
import AuthController from '../../controllers/auth.controller';
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
        return next(err);
    }

});

Router.post('/signin', async (req, res, next) => {

    try {
        const accessToken: string = await AuthController.authenticateUser(req, res, next);

        res.json({
            type: 'success',
            message: accessToken
        });
    } catch(err) {
        return next(err);
    }

});

export = Router;