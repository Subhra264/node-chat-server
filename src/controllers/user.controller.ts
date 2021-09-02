import convertToHttpErrorFrom from '../errors/errors_to_HttpError';
import HttpErrors from '../errors/http-errors';
import SelfMessages, { SelfMessage, SelfMessagesDocument } from '../models/SelfMessages.model';
import User, { UserDocument } from '../models/User.model';
import AuthenticatedRequest, { AuthenticatedCachedUser } from '../utils/interfaces/AuthenticatedRequest';

export default {
    getFriendList: async (req: AuthenticatedRequest) => {
        try {
            let user: UserDocument | AuthenticatedCachedUser = req.user;

            if (user.friends.length) {
                // If req.user is a Document
                if ((user as UserDocument).populate) {
                    user = await (user as UserDocument)
                        .populate('friends', 'username profilePic')
                        .execPopulate();
                } else {
                    user = await User.findById(user._id)
                        .populate('friends', 'username profilePic')
                        .exec();
                }
            }

            if (!user) throw HttpErrors.ServerError();
            return user.friends;
        } catch(err) {
            throw convertToHttpErrorFrom(err);
        }
    },

    getProfileData: async (req: AuthenticatedRequest) => {
        try {
            const user: UserDocument | AuthenticatedCachedUser = req.user;

            return JSON.parse(JSON.stringify({
                ...user,
                password: '' // Don't send hashed password to the client
            }));
        } catch(err) {
            throw convertToHttpErrorFrom(err);            
        }
    },

    // Returns a list of all self-messages
    getSelfMessages: async (req: AuthenticatedRequest) => {
        try {
            const user: UserDocument | AuthenticatedCachedUser = req.user;

            const selfMessages: SelfMessagesDocument = await SelfMessages.findById(user.selfMessages).exec();
            return selfMessages.messages;
        } catch(err) {
            throw convertToHttpErrorFrom(err);
        }
    },

    // saves new self-message
    newSelfMessage: async (req: AuthenticatedRequest) => {
        try {
            const user: UserDocument | AuthenticatedCachedUser = req.user;

            // Find and load the SelfMessages Document corresponding to this user
            const selfMessages: SelfMessagesDocument = await SelfMessages.findById(user.selfMessages).exec();
            // The req.body is expected to have data in SelfMessage format
            selfMessages.messages.push(req.body as SelfMessage);
            await selfMessages.save();

            return selfMessages.messages;
        } catch(err) {
            throw convertToHttpErrorFrom(err);
        }
    }
}