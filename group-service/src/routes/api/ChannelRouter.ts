import { NextFunction, Request, Response, Router } from 'express';
import { AuthenticatedRequest } from '../../middlewares/AuthMiddleware';
import convertToHttpErrorFrom from '../../errors/errorsToHttpError';
import ChannelController from '../../controllers/ChannelController';

const ChannelRouter = Router();

ChannelRouter.get(
  '/all',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const members = await ChannelController.getAll(
        req as AuthenticatedRequest,
      );

      res.json({
        status: 'success',
        message: members,
      });
    } catch (err) {
      next(convertToHttpErrorFrom(err));
    }
  },
);

ChannelRouter.post(
  '/create',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const channel = await ChannelController.create(
        req as AuthenticatedRequest,
      );
      res.json({
        status: 'success',
        message: channel,
      });
    } catch (err) {
      next(convertToHttpErrorFrom(err));
    }
  },
);

export default ChannelRouter;
