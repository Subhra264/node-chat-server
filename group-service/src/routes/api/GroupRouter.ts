import { NextFunction, Request, Response, Router } from 'express';

const GroupRouter = Router();

// TODO: Implement all the necessary routes
GroupRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.json({
    status: 'success',
    message: 'Group',
  });
});

export default GroupRouter;
