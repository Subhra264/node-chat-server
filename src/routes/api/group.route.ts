import express, { Request, Response, NextFunction} from 'express';
import GroupController from '../../controllers/group.controller';
import HttpError from '../../errors/HttpError';
import authenticate from '../../middlewares/auth.middleware';
import validateGroup from '../../middlewares/validate_group.middleware';
import AuthenticatedRequest, { GroupValidatedRequest } from '../../utils/interfaces/AuthenticatedRequest';
const Router = express.Router();

// POST request to create a new Group
Router.post('/group', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await GroupController.createGroup(req as AuthenticatedRequest);

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
        const dashBoardData = await GroupController.returnDashBoardData(req as AuthenticatedRequest);

        res.json({
            type: 'success',
            message: dashBoardData
        });
    } catch(err) {
        next(err as HttpError);
    }
});

// Responds with a list of all the groups, the user is part of
Router.get('/user/groups', authenticate, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groups = await GroupController.getGroups(req as GroupValidatedRequest);

        res.json({
            type: 'success',
            message: groups
        });
    } catch(err) {
        next(err as HttpError);
    }
});

// Responds with a list of all the members in the requested group
Router.get('/groups/:groupId/members', authenticate, validateGroup, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groupMembers = await GroupController.getGroupMembers(req as GroupValidatedRequest);

        res.json({
            type: 'success',
            message: groupMembers
        });
    } catch(err) {
        next(err as HttpError);
    }
});

// Responds with a list of all the channels in the requested group
Router.get('/groups/:groupId/channels', authenticate, validateGroup, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groupChannels = await GroupController.getChannels(req as GroupValidatedRequest);

        res.json({
            type: 'success',
            message: groupChannels
        });
    } catch(err) {
        next(err as HttpError);
    }
});

export = Router;