import AuthenticatedRequest, { AuthenticatedCachedUser } from "../utils/interfaces/AuthenticatedRequest";
import TextChannel_Joi from "../utils/validate_schema/validate_text_channel";
import HttpErrors from '../errors/http-errors';
import Group, { GroupDocument } from "../models/Group.model";
import TextChannel, { Message, TextChannelDocument, TextChannelSchema } from "../models/channels/TextChannel.model";
import MessageReqSchema_Joi from "../utils/validate_schema/validate_message";
import convertToHttpErrorFrom from "../errors/errors_to_HttpError";

interface GetMessageReturnType {
    name: string;
    messages: Message[];
}

export default {
    createTextChannel: async (req: AuthenticatedRequest): Promise<any> => {
        try {
            const validatedTextChannel: TextChannelSchema = await TextChannel_Joi.validateAsync(req.body);
            // Here, methods and properties of Document are not used, so it is safe
            // to type cast user as AuthenticatedCachedUser.
            const user: AuthenticatedCachedUser = req.user as AuthenticatedCachedUser;

            // Check if the user is part of the group
            let isAllowed = false;
            user.groups.forEach((group: any) => {
                // When req.user is cached data, req.user will not contain 'Document.id' getter property
                // which returns the stringified value of Document._id. Hence, we must use the Document._id
                // property, but again, the first time, when req.user is actually a Document,
                // Document._id needs to be stringified.
                if (JSON.stringify(group._id) === `"${validatedTextChannel.parentGroup}"`) {
                    isAllowed = true;
                }
            });

            if (!isAllowed) throw HttpErrors.Forbidden();

            const newTextChannel: TextChannelDocument = await (new TextChannel(validatedTextChannel) as TextChannelDocument).save();

            const newTextChannel_ = {
                name: newTextChannel.name,
                reference: newTextChannel._id
            };

            const parentGroup: GroupDocument = await Group.findById(validatedTextChannel.parentGroup).exec();
            console.log('ParentGroup createTextChannel', parentGroup);
            parentGroup.textChannels.push(newTextChannel_);

            return newTextChannel_;

        } catch(err) {
            throw convertToHttpErrorFrom(err);
        }
    },

    getMessages: async (req: AuthenticatedRequest): Promise<GetMessageReturnType> => {
        try {
            const { groupId, textChannelId } = req.query;

            let isAllowed = false;
            req.user.groups.forEach((groupId_) => {
                if (JSON.stringify(groupId_) === `"${groupId}"`) {
                    isAllowed = true;
                }
            });

            if (!isAllowed) throw HttpErrors.Forbidden();
            const textChannel: TextChannelDocument = await TextChannel.findOne({
                    _id: textChannelId,
                    parentGroup: groupId
                })
                .populate('messages.sender', 'username profilePic')
                .exec();

            if (!textChannel) throw HttpErrors.Forbidden();
            return {
                name: textChannel.name,
                messages: textChannel.messages
            };

        } catch(err) {
            throw convertToHttpErrorFrom(err);
        }
    },

    // Adds a given message to the database
    saveMessage: async (req: AuthenticatedRequest): Promise<void> => {
        try {
            const user: AuthenticatedCachedUser = req.user as AuthenticatedCachedUser;
            const { channelId, message, groupId } = await MessageReqSchema_Joi.validateAsync(req.body);

            const textChannel: TextChannelDocument = await TextChannel.findOne({
                    _id: channelId, 
                    parentGroup: groupId
                }).exec();
            
            if (!textChannel) throw HttpErrors.Forbidden();
            
            textChannel.messages.push({
                message,
                sender: user._id
            });

            await textChannel.save();
            
        } catch(err) {
            throw convertToHttpErrorFrom(err);
        }
    }
}