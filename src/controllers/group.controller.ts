import { NextFunction, Response } from "express";
import mongoose from "mongoose";
import convertToHttpErrorFrom from "../errors/errors_to_HttpError";
import HttpErrors from "../errors/http-errors";
import TextChannel, { TextChannelDocument } from "../models/channels/TextChannel.model";
import Group, { GroupDocument, GroupSchema } from "../models/Group.model";
import AuthenticatedRequest, { AuthenticatedUser } from "../utils/interfaces/AuthenticatedRequest";
import groupSchema from "../utils/validate_schema/validate_group";

// interface ChatData {
//     groups
// }

export default {
    createGroup: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const validatedGroup: GroupSchema = await groupSchema.validateAsync(req.body);

            const parentGroupId = new mongoose.Types.ObjectId();
            const welcomeChannel: TextChannelDocument = new TextChannel({
                name: 'welcome',
                parentGroup: parentGroupId
            });

            const welcomeDoc: TextChannelDocument = await welcomeChannel.save();

            const newGroup: GroupDocument = await (new Group({
                _id: parentGroupId,
                ...validatedGroup,
                users: [
                    req.user._id
                ],
                textChannels: [
                    welcomeDoc._id
                ]
            }) as GroupDocument).save();

            req.user.groups.push(newGroup._id);
            await req.user.save();

        } catch(err) {
            throw convertToHttpErrorFrom(err);
        }
    },

    // TODO: Rethink over the data fetching implementation
    returnDashBoardData: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {

            // TODO: Give chatData a type
            const dashBoardData: any = {};
            const user: AuthenticatedUser = req.user;
            const { groupId, channelId } = req.body;
            
            dashBoardData.groups = (await user.populate('groups', 'name image').execPopulate()).groups;

            let isGroupIdValid = false;
            dashBoardData.groups?.forEach((group) => {
                if (group.id === groupId) {
                    isGroupIdValid = true;
                }
            });
            
            if (!isGroupIdValid) throw HttpErrors.Forbidden();

            const group: GroupDocument = await Group.findById(groupId)
                .populate('textChannels', 'name')
                .populate('users', 'userName profilePic')
                .exec();

            const textChannel: TextChannelDocument = await TextChannel.findOne({
                    _id: channelId,
                    parentGroup: groupId
                })
                .populate('messages.sender', 'userName profilePic')
                .exec();

            if (!textChannel) throw HttpErrors.Forbidden();

            dashBoardData.textChannels = group.textChannels;
            dashBoardData.voiceChannels = group.voiceChannels;
            dashBoardData.messages = textChannel.messages;
            dashBoardData.users = group.users;

            return dashBoardData;

        } catch(err) {
            throw convertToHttpErrorFrom(err);
        }
    }
}