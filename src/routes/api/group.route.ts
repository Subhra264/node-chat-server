import express, { Request, Response, NextFunction} from 'express';
import GroupController from '../../controllers/group.controller';
import HttpError from '../../errors/HttpError';
import authenticate from '../../middlewares/auth.middleware';
import AuthenticatedRequest from '../../utils/interfaces/AuthenticatedRequest';
const Router = express.Router();

Router.get('/group', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        //const groupData = await GroupController.returnGroupData(req, res, next);

        // res.json({
        //     type: 'success',
        //     message: groupData
        // });
    } catch(err) {
        next(err as HttpError);
    }
});

// POST request to create a new Group
Router.post('/group', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await GroupController.createGroup((req as AuthenticatedRequest), res,  next);

        res.json({
            type: 'success',
            message: 'Group created successfully!'
        });
    } catch(err) {
        next(err as HttpError);
    }
});

Router.get('/user/dashboard/:groupId/:channelId', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dashBoardData = await GroupController.returnDashBoardData((req as AuthenticatedRequest), res, next);

        res.json({
            type: 'success',
            message: dashBoardData
        });
    } catch(err) {
        next(err as HttpError);
    }
});

export = Router;