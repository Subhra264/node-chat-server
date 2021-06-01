import { NextFunction, Response } from "express";
import AuthenticatedRequest, { AuthenticatedUser } from "../utils/interfaces/AuthenticatedRequest";
import TextChannel_Joi from "../utils/validate_schema/validate_text_channel";
import HttpErrors from '../errors/http-errors';
import Group from "../models/Group.model";
import TextChannel, { Message, TextChannelDocument, TextChannelSchema } from "../models/channels/TextChannel.model";
import MessageReqSchema_Joi from "../utils/validate_schema/validate_message";

export default {
    createTextChannel: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const validatedTextChannel: TextChannelSchema = await TextChannel_Joi.validateAsync(req.body);
            const user: AuthenticatedUser = req.user;

            // Check if the user is part of the group
            let isAllowed = false;
            user.groups.forEach(groupId => {
                if (JSON.stringify(groupId) === `"${validatedTextChannel.parentGroup}"`) {
                    isAllowed = true;
                }
            });

            if (!isAllowed) throw HttpErrors.Forbidden();

            const newTextChannel: TextChannelDocument = await (new TextChannel(validatedTextChannel) as TextChannelDocument).save();

            await Group.findByIdAndUpdate(validatedTextChannel.parentGroup, {
                    $push: { textChannels: newTextChannel._id }
                }).exec();

        } catch(err) {
            if (err.isJoi) {
                err = HttpErrors.BadRequest();
            }

            if (!err.isHttpError) {
                err = HttpErrors.ServerError();
            }

            throw err;
        }
    },

    getMessages: async (req: AuthenticatedRequest): Promise<Message[]> => {
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
                .populate('messages.sender', 'userName profilePic')
                .exec();

            if (!textChannel) throw HttpErrors.Forbidden();
            return textChannel.messages;

        } catch(err) {
            if (!err.isHttpError) {
                err = HttpErrors.ServerError();
            }

            throw err;
        }
    },

    // Add a given message to the database
    saveMessage: async (req: AuthenticatedRequest): Promise<void> => {
        try {
            const user: AuthenticatedUser = req.user;
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
            if (err.isJoi) {
                err = HttpErrors.BadRequest();
            } else if (!err.isHttpError) {
                err = HttpErrors.ServerError(err.message);
            }

            throw err;
        }
    }
}