import mongoose, { Schema } from 'mongoose';
import convertToHttpErrorFrom from '../errors/errors_to_HttpError';
import HttpErrors from '../errors/http-errors';
import TextChannel, {
  TextChannelDocument,
} from '../models/channels/TextChannel.model';
import Group, { GroupDocument, GroupSchema } from '../models/Group.model';
import User, { UserDocument } from '../models/User.model';
import AuthenticatedRequest, {
  AuthenticatedCachedUser,
  GroupValidatedRequest,
} from '../utils/interfaces/AuthenticatedRequest';
import {
  GroupInvitationPayload,
  TokenKeyType,
} from '../utils/interfaces/JWTUtils';
import { signJWTToken, verifyToken } from '../utils/jwt_utils/jwt_utils';
import groupSchema from '../utils/validate_schema/validate_group';

// interface ChatData {
//     groups
// }

interface CreateGroupReturnType {
  _id: any;
  defaultChannel: Schema.Types.ObjectId;
  name: string;
  image: string | undefined;
}

type GetChannelsReturnType = [
  {
    name: string;
    reference: Schema.Types.ObjectId;
  },
];

interface GroupInvitationToken {
  invitationToken: string;
}

export default {
  createGroup: async (
    req: AuthenticatedRequest,
  ): Promise<CreateGroupReturnType> => {
    try {
      const validatedGroup: GroupSchema = await groupSchema.validateAsync(
        req.body,
      );

      const parentGroupId = new mongoose.Types.ObjectId();
      const welcomeChannel: TextChannelDocument = new TextChannel({
        name: 'welcome',
        parentGroup: parentGroupId,
      });

      const welcomeDoc: TextChannelDocument = await welcomeChannel.save();

      const newGroup: GroupDocument = await (
        new Group({
          _id: parentGroupId,
          ...validatedGroup,
          defaultChannel: welcomeDoc._id,
          users: [req.user._id],
          textChannels: [
            {
              name: welcomeDoc.name,
              reference: welcomeDoc._id,
            },
          ],
        }) as GroupDocument
      ).save();

      let user: UserDocument | null = null;

      // If req.user is not cached data
      if ((req.user as UserDocument).updateOne) {
        // Be careful here, AuthenticatedUser doesn't contain password and refresh-token
        // Whereas, password is required in UserDocument.
        // According to the current implementation, password is actually included in req.user
        // So, for now, it can be safely casted to UserDocument.
        user = req.user as UserDocument;
      } else {
        user = await User.findById(req.user._id).exec();
      }

      if (!user) throw HttpErrors.ServerError('Oops, something went wrong!!!');

      // Don't use Document.updateOne or Document.update to update this document
      // Both of them don't return the modified document
      user.groups.push(newGroup._id);
      await user.save();

      return {
        _id: newGroup.id,
        defaultChannel: newGroup.defaultChannel,
        name: newGroup.name,
        image: newGroup.image,
      };
    } catch (err) {
      throw convertToHttpErrorFrom(err);
    }
  },

  // TODO: Rethink over the data fetching implementation
  returnDashBoardData: async (req: AuthenticatedRequest): Promise<any> => {
    try {
      // TODO: Give chatData a type
      const dashBoardData: any = {};
      const user: AuthenticatedCachedUser | UserDocument = req.user;
      const { groupId, channelId } = req.params;

      // TODO: Fix the implementation properly
      // dashBoardData.groups = (await user.populate('groups', 'name image').execPopulate()).groups;
      dashBoardData.groups = user.groups;

      let isGroupIdValid = false;
      // TODO: Use a better implementation
      dashBoardData.groups?.forEach((group) => {
        if (JSON.stringify(group._id) === `"${groupId}"`) {
          isGroupIdValid = true;
        }
      });

      if (!isGroupIdValid) throw HttpErrors.Forbidden();

      const group: GroupDocument = await Group.findById(groupId)
        .populate('users', 'username profilePic')
        .exec();

      const textChannel: TextChannelDocument = await TextChannel.findOne({
        _id: channelId,
        parentGroup: groupId,
      })
        .populate('messages.sender', 'username profilePic')
        .exec();

      if (!textChannel) throw HttpErrors.Forbidden();

      dashBoardData.textChannels = group.textChannels;
      dashBoardData.voiceChannels = group.voiceChannels;
      dashBoardData.messages = textChannel.messages;
      dashBoardData.users = group.users;

      return dashBoardData;
    } catch (err) {
      throw convertToHttpErrorFrom(err);
    }
  },

  // Returns all the groups the user is part of
  getGroups: async (
    req: AuthenticatedRequest,
  ): Promise<[Schema.Types.ObjectId]> => {
    try {
      const user: AuthenticatedCachedUser | UserDocument = req.user;

      // Todo: Must also return the id of each group's welcome channel
      return user.groups;
    } catch (err) {
      throw convertToHttpErrorFrom(err);
    }
  },

  // Returns all the members of the requested Group
  getGroupMembers: async (
    req: GroupValidatedRequest,
  ): Promise<[Schema.Types.ObjectId]> => {
    try {
      // Assuming that the groupId is valid
      const populatedGroup = await req.validatedGroup
        .populate('users', 'username profilePic')
        .execPopulate();

      return populatedGroup.users;
    } catch (err) {
      throw convertToHttpErrorFrom(err);
    }
  },

  // Returns a list of channels
  getChannels: async (
    req: GroupValidatedRequest,
  ): Promise<GetChannelsReturnType> => {
    try {
      const channelList = req.validatedGroup.textChannels;

      return channelList;
    } catch (err) {
      throw convertToHttpErrorFrom(err);
    }
  },

  createGroupInvitationToken: async (
    req: AuthenticatedRequest,
  ): Promise<GroupInvitationToken> => {
    try {
      const { groupId } = req.body;
      const user: AuthenticatedCachedUser | UserDocument = req.user;

      let isAllowed = false;
      user.groups.map((group: any) => {
        // Check if user is part of the requested group
        if (JSON.stringify(group._id) === `"${groupId}"`) {
          isAllowed = true;
        }
      });

      if (!isAllowed) throw HttpErrors.Forbidden();

      const groupInvitationPayload: GroupInvitationPayload = {
        groupId,
        userId: user._id,
      };
      const groupInvitationToken = await signJWTToken(
        groupInvitationPayload,
        TokenKeyType.JWT_GROUP_INVITATION_KEY,
      );

      return {
        invitationToken: groupInvitationToken,
      };
    } catch (err) {
      throw convertToHttpErrorFrom(err);
    }
  },

  joinGroup: async (req: AuthenticatedRequest): Promise<void> => {
    try {
      const { encryptedGroupId } = req.body;
      let user: UserDocument | null = null;
      if (!encryptedGroupId) throw HttpErrors.BadRequest();

      const payload = await verifyToken(
        encryptedGroupId,
        TokenKeyType.JWT_GROUP_INVITATION_KEY,
      );
      const group: GroupDocument = await Group.findById(payload.groupId).exec();

      if ((req.user as UserDocument).updateOne) {
        // Be careful here, AuthenticatedUser doesn't contain password and refresh-token
        // Whereas, password is required in UserDocument.
        // According to the current implementation, password is actually included in req.user
        // So, for now, it can be safely casted to UserDocument.
        user = req.user as UserDocument;
      } else {
        user = await User.findById(req.user._id).exec();
      }
      if (!user) throw HttpErrors.ServerError('Oops, something went wrong!!!');
      group.users.push(user._id);

      // Don't use Document.updateOne or Document.update to update this document
      // Both of them don't return the modified document
      user.groups.push(group._id);
      await user.save();
    } catch (err) {
      throw convertToHttpErrorFrom(err);
    }
  },
};
