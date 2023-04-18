import PrismaORM from '../init/prisma.init';

const prisma = PrismaORM.get();
const PAGE_SIZE = 20;

interface AddGroupMessageArgs {
  userId: string;
  groupId: string;
  channelId: string;
  message: string;
  encKey: string;
}

interface AddFriendMessageArgs {
  senderId: string;
  receiverId: string;
  message: string;
}

export default {
  getChannelMessages: async (
    groupId: string,
    channelId: string,
    page: number,
  ) => {
    try {
      // TODO: Check if the user is member of the group
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
  addGroupMessage: async (data: AddGroupMessageArgs) => {
    try {
      // TODO: Check if the group exists and if the user is a member
      const groupMessage = await prisma.groupMessage.create({
        data,
      });
      return groupMessage;
    } catch (err) {
      throw err;
    }
  },
  addFriendMessage: async (data: AddFriendMessageArgs) => {
    try {
      // TODO: Check if the friend exists
      const friendMessage = await prisma.friendMessage.create({
        data,
      });
      return friendMessage;
    } catch (err) {
      throw err;
    }
  },
};
