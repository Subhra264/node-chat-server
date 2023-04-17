import PrismaORM from '../init/prisma.init';

const prisma = PrismaORM.get();
const PAGE_SIZE = 20;

export default {
  getChannelMessages: async (
    groupId: string,
    channelId: string,
    page: number,
  ) => {
    try {
      const messages = await prisma.groupMessage.findMany({
        orderBy: [{ timestamp: 'desc' }],
        where: {
          groupId,
          channelId,
        },
        skip: page * PAGE_SIZE,
        take: PAGE_SIZE,
      });

      return messages;
    } catch (err) {
      throw err;
    }
  },
  getFriendMessages: async (userId: string, friendId: string, page: number) => {
    try {
      const messages = await prisma.friendMessage.findMany({
        orderBy: [{ timestamp: 'desc' }],
        where: {
          OR: [
            { senderId: userId, receiverId: friendId },
            { senderId: friendId, receiverId: userId },
          ],
        },
        skip: page * PAGE_SIZE,
        take: PAGE_SIZE,
      });

      return messages;
    } catch (err) {
      throw err;
    }
  },
  getSelfMessages: async (userId: string, page: number) => {
    try {
      const messages = await prisma.selfMessage.findMany({
        orderBy: [{ timestamp: 'desc' }],
        where: {
          userId,
        },
        skip: page * PAGE_SIZE,
        take: PAGE_SIZE,
      });

      return messages;
    } catch (err) {
      throw err;
    }
  },

  addSelfMessage: async (userId: string, message: string, encKey: string) => {
    try {
      const selfMessage = await prisma.selfMessage.create({
        data: {
          userId,
          message,
          encKey,
        },
      });

      return selfMessage;
    } catch (err) {
      throw err;
    }
  },
};
