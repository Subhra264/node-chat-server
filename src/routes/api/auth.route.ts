const { createAccount } = require('../../controllers/auth.controller');
import express, { Request, Response, NextFunction } from 'express';
const Router = express.Router();

Router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {

    try {

        const hash = await createAccount(req, res);

        res.json({
            type: 'success',
            // message: "Signed Up successfully!"
            message: hash
        });
    } catch(err) {
        next(err);
    }

});

Router.post('/signin', async (req, res, next) => {
    res.json({
        type: 'success',
        message: "Signed in!"
    });
});

export = Router;