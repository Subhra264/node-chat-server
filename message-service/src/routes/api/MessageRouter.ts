import { NextFunction, Request, Response, Router } from 'express';
import MessageController from '../../controllers/MessageController';
import { AuthenticatedRequest } from '../../middlewares/AuthMiddleware';
import convertToHttpErrorFrom from '../../errors/errorsToHttpError';

const MessageRouter = Router();

MessageRouter.get(
  '/group/:groupId/:channelId/page/:page',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await MessageController.getGroupMessages(
        req as AuthenticatedRequest,
      );
      res.json({
        status: 'success',
        message: messages,
      });
    } catch (err) {
      next(convertToHttpErrorFrom(err));
    }
  },
);

MessageRouter.get(
  '/friend/:friendId/page/:page',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await MessageController.getFriendMessages(
        req as AuthenticatedRequest,
      );
      res.json({
        status: 'success',
        message: messages,
      });
    } catch (err) {
      next(convertToHttpErrorFrom(err));
    }
  },
);

MessageRouter.get(
  '/self/page/:page',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const messages = await MessageController.getSelfMessagaes(
        req as AuthenticatedRequest,
      );
      res.json({
        status: 'success',
        message: messages,
      });
    } catch (err) {
      next(convertToHttpErrorFrom(err));
    }
  },
);

MessageRouter.post(
  '/self',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const message = await MessageController.addSelfMessage(
        req as AuthenticatedRequest,
      );
      res.json({
        status: 'success',
        message,
      });
    } catch (err) {
      next(convertToHttpErrorFrom(err));
    }
  },
);

export default MessageRouter;
