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
      return await GroupService.createGroup(req.body, req.userId);
    } catch (err) {
      throw err;
    }
  },

  getGroup: async (req: AuthenticatedRequest) => {
    try {
      return await GroupService.getGroup(req.params.groupId);
    } catch (err) {
      if ((err as any).code === 'P2025') throw HttpErrors.NotFound();
      throw err;
    }
  },

  // Returns all the groups the user is part of
  getGroups: async (req: AuthenticatedRequest) => {
    try {
      return await GroupService.getGroups(req.userId);
    } catch (err) {
      throw err;
    }
  },
};
