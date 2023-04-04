import convertToHttpErrorFrom from '../errors/errorsToHttpError';
import HttpErrors from '../errors/http-errors';
import GroupService from '../services/GroupService';
import { verifyToken, TokenKeyType } from '../utils/jwt';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';

// interface CreateGroupReturnType {
//   id: any;
//   defaultChannel: Schema.Types.ObjectId;
//   name: string;
//   image: string | undefined;
// }

interface GroupInvitationToken {
  invitationToken: string;
}

export default {
  createGroup: async (req: AuthenticatedRequest) => {
    try {
      return GroupService.createGroup(req.body, req.userId);
    } catch (err) {
      throw convertToHttpErrorFrom(err);
    }
  },

  // Returns all the groups the user is part of
  getGroups: async (req: AuthenticatedRequest) => {
    try {
      return await GroupService.getGroups(req.userId);
    } catch (err) {
      throw convertToHttpErrorFrom(err);
    }
  },

  // Returns all the members of the requested Group
  getGroupMembers: async (req: AuthenticatedRequest) => {
    try {
      // Assuming that the groupId is valid
      return await GroupService.getMembers(req.body.groupId);
    } catch (err) {
      throw convertToHttpErrorFrom(err);
    }
  },

  createGroupInvitationToken: async (req: AuthenticatedRequest) => {
    try {
      return await GroupService.createInvitation(req.body.groupId, req.userId);
    } catch (err) {
      throw convertToHttpErrorFrom(err);
    }
  },

  joinGroup: async (req: AuthenticatedRequest): Promise<void> => {
    try {
      const { encryptedGroupId } = req.body;
      if (!encryptedGroupId) throw HttpErrors.BadRequest();

      const payload = await verifyToken(
        encryptedGroupId,
        TokenKeyType.JWT_GROUP_INVITATION_KEY,
      );

      return await GroupService.joinGroup(
        payload.groupId as string,
        req.userId,
      );
    } catch (err) {
      throw convertToHttpErrorFrom(err);
    }
  },
};
