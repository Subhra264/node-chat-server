import { NextFunction, Request, Response, Router } from 'express';
import GroupController from '../../controllers/GroupController';
import { AuthenticatedRequest } from '../../middlewares/AuthMiddleware';
import convertToHttpErrorFrom from '../../errors/errorsToHttpError';

const GroupRouter = Router();

// TODO: Implement all the necessary routes

GroupRouter.get(
  '/find',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const groups = await GroupController.getGroups(
        req as AuthenticatedRequest,
      );
      res.json({
        status: 'success',
        message: groups,
      });
    } catch (err) {
      next(convertToHttpErrorFrom(err));
    }
  },
);

GroupRouter.get(
  '/find/:groupId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const group = GroupController.getGroup(req as AuthenticatedRequest);
      res.json({
        status: 'success',
        message: group,
      });
    } catch (err) {
      next(convertToHttpErrorFrom(err));
    }
  },
);

GroupRouter.post(
  '/create',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newGroup = await GroupController.createGroup(
        req as AuthenticatedRequest,
      );
      res.json({
        status: 'success',
        message: newGroup,
      });
    } catch (err) {
      next(convertToHttpErrorFrom(err));
    }
  },
);

export default GroupRouter;
