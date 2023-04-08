import { NextFunction, Request, Response, Router } from 'express';
import { AuthenticatedRequest } from '../../middlewares/AuthMiddleware';
import convertToHttpErrorFrom from '../../errors/errorsToHttpError';
import MemberController from '../../controllers/MemberController';

const MemberRouter = Router();

MemberRouter.get(
  '/all',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const members = await MemberController.getGroupMembers(
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

MemberRouter.post(
  '/join',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const record = await MemberController.joinGroup(
        req as AuthenticatedRequest,
      );
      res.json({
        status: 'success',
        message: record,
      });
    } catch (err) {
      next(convertToHttpErrorFrom(err));
    }
  },
);

MemberRouter.post(
  '/invite',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invitation = await MemberController.createInvitationToken(
        req as AuthenticatedRequest,
      );
      res.json({
        status: 'success',
        message: invitation,
      });
    } catch (err) {
      next(convertToHttpErrorFrom(err));
    }
  },
);

export default MemberRouter;
