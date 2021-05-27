import { NextFunction, Response } from "express";
import mongoose, { Document } from "mongoose";
import HttpErrors from "../errors/http-errors";
import TextChannel from "../models/channels/TextChannel.model";
import Group from "../models/Group.model";
import AuthenticatedRequest, { AuthenticatedUser } from "../utils/interfaces/AuthenticatedRequest";
import groupSchema from "../utils/validate_schema/validate_group";

// interface ChatData {
//     groups
// }

export default {
    createGroup: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            // TODO: Give validatedGroup a type
            const validatedGroup = await groupSchema.validateAsync(req.body);

            const parentGroupId = new mongoose.Types.ObjectId();
            // TODO: Give welcomeChannel a TextChannelDocument type
            const welcomeChannel: Document = new TextChannel({
                name: 'welcome',
                parentGroup: parentGroupId
            });

            const welcomeDoc = await welcomeChannel.save();

            const newGroup = await (new Group({
                _id: parentGroupId,
                ...validatedGroup,
                users: [
                    req.user._id
                ],
                textChannels: [
                    welcomeDoc._id
                ]
            }) as Document).save();

            req.user.groups?.push(newGroup._id);
            await req.user.save();

        } catch(err) {
            console.log('Error creating group', err);
            if (err.isJoi) {
                err = HttpErrors.BadRequest('Please fill all the fields correctly!');
            }

            if (!err.isHttpError) {
                err = HttpErrors.ServerError();
            }

            throw err;
        }
    },

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
            chatData.groups = await user.populate('groups', 'name profilePic')
                .populate({
                    path: 'groups',
                    match: { _id: { $eq: JSON.stringify(groupId) } }
                }).execPopulate();
            console.log(chatData.groups);
            
            return chatData;
            // Group.findById(groupId)

        } catch(err) {
            throw err;
        }
    }
}