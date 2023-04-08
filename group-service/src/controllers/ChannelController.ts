import { AuthenticatedRequest } from '../middlewares/AuthMiddleware';
import ChannelService from '../services/ChannelService';

export default {
  create: async (req: AuthenticatedRequest) => {
    try {
      return await ChannelService.create(req.body.groupId);
    } catch (err) {
      throw err;
    }
  },
  getAll: async (req: AuthenticatedRequest) => {
    try {
      return await ChannelService.getAll(req.body);
    } catch (err) {
      throw err;
    }
  },
};
