import {
  Router as ExpressRouter,
  Request,
  Response,
  NextFunction,
} from 'express';
import AuthController from '../../controllers/AuthController';
import convertToHttpErrorFrom from '../../errors/errorsToHttpError';

const AuthRouter = ExpressRouter();

AuthRouter.post(
  '/create',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await AuthController.createAccount(req);

      res.status(200).json({
        status: 'success',
        message: 'Account created!',
      });
    } catch (err) {
      next(convertToHttpErrorFrom(err));
    }
  },
);

AuthRouter.post(
  '/sign-in',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken, ...userDetails } =
        await AuthController.authenticateUser(req);

      // Send back the refreshToken as a httponly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
      });

      res.json({
        status: 'success',
        message: userDetails,
      });
    } catch (err) {
      next(convertToHttpErrorFrom(err));
    }
  },
);

AuthRouter.post(
  '/access-token',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userDetails = await AuthController.refreshAccessToken(req);

      res.json({
        status: 'success',
        message: userDetails,
      });
    } catch (err) {
      next(convertToHttpErrorFrom(err));
    }
  },
);

export default AuthRouter;
