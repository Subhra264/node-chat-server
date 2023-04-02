import { NextFunction, Request, Response, Router } from 'express';

const GroupRouter = Router();

GroupRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({
    status: 'success',
    message: 'Group',
  });
});

export default GroupRouter;
