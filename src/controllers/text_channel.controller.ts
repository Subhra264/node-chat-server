import { NextFunction, Response } from "express";
import AuthenticatedRequest from "../utils/interfaces/AuthenticatedRequest";
import TextChannelSchema from "../utils/validate_schema/validate_text_channel";
import HttpErrors from '../errors/http-errors';
import Group from "../models/Group.model";
import TextChannel from "../models/channels/TextChannel.model";
import { Document } from "mongoose";

export default {
    createTextChannel: async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            const validatedTextChannel = await TextChannelSchema.validateAsync(req.body);
            const authenticatedUser = req.user;

            // Check if the user is part of the group
            let isAllowed = false;
            authenticatedUser.groups?.forEach(groupId => {
                if (JSON.stringify(groupId) === `"${validatedTextChannel.parentGroup}"`) {
                    isAllowed = true;
                }
            });

            if (!isAllowed) throw HttpErrors.Forbidden();

            // TODO: Define an interface for TextChannel model and use that instead of Document
            const newTextChannel = await (new TextChannel(validatedTextChannel) as Document).save();

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
    }
}