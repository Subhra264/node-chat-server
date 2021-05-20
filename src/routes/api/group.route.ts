import express, { Request, Response, NextFunction} from 'express';

const Router = express.Router();

Router.post('/group', async (req: Request, res: Response, next: NextFunction) => {
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

Router.post('/user/chat', (req: Request, res: Response, next: NextFunction) => {
    try {
        // const chatData = GroupCrontoller.returnChatData(req, res, next);

        res.json({
            type: 'success',
            // message: chatData
        })
    } catch(err) {
        next(err);
    }
});

