import { NextFunction, Response } from "express";
import AuthenticatedRequest from "../utils/interfaces/AuthenticatedRequest";
import TextChannel_Joi from "../utils/validate_schema/validate_text_channel";
import HttpErrors from '../errors/http-errors';
import Group from "../models/Group.model";
import TextChannel, { TextChannelDocument, TextChannelSchema } from "../models/channels/TextChannel.model";

export default {
    createTextChannel: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const validatedTextChannel: TextChannelSchema = await TextChannel_Joi.validateAsync(req.body);
            const authenticatedUser = req.user;

            // Check if the user is part of the group
            let isAllowed = false;
            authenticatedUser.groups?.forEach(groupId => {
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

    getMessages: async (req: AuthenticatedRequest) => {
        try {
            const { groupId, textChannelId } = req.query;

            let isAllowed = false;
            req.user.groups?.forEach((groupId_) => {
                if (JSON.stringify(groupId_) === `"${groupId}"`) {
                    isAllowed = true;
                }
            });

            if (!isAllowed) throw HttpErrors.Forbidden();
            const textChannel: TextChannelDocument = await TextChannel.findOne({
                _id: textChannelId,
                parentGroup: groupId
            }).exec();

            if (!textChannel) throw HttpErrors.Forbidden();
            return textChannel.messages;

        } catch(err) {
            if (!err.isHttpError) {
                err = HttpErrors.ServerError();
            }

            throw err;
        }
    }
}