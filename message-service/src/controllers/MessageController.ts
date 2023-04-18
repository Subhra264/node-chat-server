import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import MessageService from '../services/MessageService';

export default {
  getGroupMessages: async (req: AuthenticatedRequest) => {
    try {
      const { groupId, channelId, page } = req.params;
      return await MessageService.getChannelMessages(
        groupId,
        channelId,
        Number(page),
      );
    } catch (err) {
      throw err;
    }
  },
  getFriendMessages: async (req: AuthenticatedRequest) => {
    try {
      const { friendId, page } = req.params;
      return await MessageService.getFriendMessages(
        req.userId,
        friendId,
        Number(page),
      );
    } catch (err) {
      throw err;
    }
  },
  getSelfMessagaes: async (req: AuthenticatedRequest) => {
    try {
      const { page } = req.params;
      return await MessageService.getSelfMessages(req.userId, Number(page));
    } catch (err) {
      throw err;
    }
  },

  addSelfMessage: async (req: AuthenticatedRequest) => {
    try {
      const msg = req.body as { message: string; encKey: string };
      return await MessageService.addSelfMessage(
        req.userId,
        msg.message,
        msg.encKey,
      );
    } catch (err) {
      throw err;
    }
  },
};
