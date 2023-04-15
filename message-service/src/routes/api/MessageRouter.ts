import { NextFunction, Request, Response, Router } from 'express';

const MessageRouter = Router();

MessageRouter.get(
  '/group/:groupId/:channelId/page/:page',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (err) {}
  },
);

MessageRouter.get(
  '/friend/:friendId/page/:page',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (err) {}
  },
);

MessageRouter.get(
  '/self/page/:page',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (err) {}
  },
);

MessageRouter.post(
  '/self',
  (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (err) {}
  },
);

export default MessageRouter;
