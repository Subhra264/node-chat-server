import MemberService from '../services/MemberService';
import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';

export default {
  // Returns all the members of the requested Group
  getGroupMembers: async (req: AuthenticatedRequest) => {
    try {
      // Assuming that the groupId is valid
      return await MemberService.getMembers(req.body.groupId);
    } catch (err) {
      throw err;
    }
  },

  createInvitationToken: async (req: AuthenticatedRequest) => {
    try {
      return await MemberService.createInvitation(req.body.groupId, req.userId);
    } catch (err) {
      throw err;
    }
  },

  joinGroup: async (req: AuthenticatedRequest) => {
    try {
      const { token } = req.body;
      return await MemberService.joinGroup(token as string);
    } catch (err) {
      throw err;
    }
  },
};
