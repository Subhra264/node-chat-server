import { NextFunction, Response } from "express";
// import { Document } from "mongoose";
// import Group from "../models/Group.model";
import AuthenticatedRequest, { AuthenticatedUser } from "../utils/interfaces/AuthenticatedRequest";

// interface ChatData {
//     groups
// }

export default {
    returnChatData: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {

            // TODO: Give chatData a type
            const chatData: any = {};
            const user: AuthenticatedUser = req.user;
            const { groupId, channelId } = req.body;

            // user.groups?.forEach((groupId_, index) => {
            //     if (JSON.stringify(groupId_) === JSON.stringify(groupId)) {
            //         (user.groups)![index].populate('g')
            //     }
            // })
            
            // chatData.groups = await (await user.populate('groups', 'name profilePic _id').execPopulate()).groups;
            chatData.groups = await user.populate({
                path: 'groups',
                match: { _id: { $eq: JSON.stringify(groupId) } }
            }).execPopulate();
            console.log(chatData.groups);
            
            return chatData;
            // Group.findById(groupId)

        } catch(err) {
            next(err);
        }
    }
}