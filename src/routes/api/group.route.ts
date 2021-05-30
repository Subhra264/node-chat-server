import express, { Request, Response, NextFunction} from 'express';
import GroupController from '../../controllers/group.controller';
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
        next(err);
    }
});

// POST request to create a new Group
Router.post('/group', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await GroupController.createGroup((req as AuthenticatedRequest), res,  next);

        res.json({
            type: 'success',
            message: 'Group created successfully!'
        })
    } catch(err) {
        next(err);
    }
});

Router.post('/group/text-channel/messages', async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const messages = GroupController.returnMessages(req, res, next);
        
        res.json({
            type: 'success',
            // message: messages
        })
    } catch(err) {
        next(err);
    }
});

Router.post('/user/dashboard', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const dashBoardData = await GroupController.returnDashBoardData((req as AuthenticatedRequest), res, next);

        res.json({
            type: 'success',
            message: dashBoardData
        })
    } catch(err) {
        next(err);
    }
});

export = Router;