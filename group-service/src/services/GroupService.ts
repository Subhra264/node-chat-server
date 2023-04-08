import PrismaORM from '../init/prisma.init';
import groupSchema, { GroupSchema } from '../utils/validateGroupSchema';
import { ChannelType } from '@prisma/client';

const prisma = PrismaORM.get();

export default {
  createGroup: async (groupBody: GroupSchema, creator: string) => {
    try {
      const validatedGroup: GroupSchema = await groupSchema.validateAsync(
        groupBody,
      );

      // Creates a new Group, add this user as a member and creates a default channel
      const newGroup = await prisma.group.create({
        data: {
          ...validatedGroup,
          members: {
            create: { userId: creator },
          },
          channels: {
            create: { name: 'welcome', type: ChannelType.TEXT, default: true },
          },
        },
      });

      return newGroup;
    } catch (err) {
      throw err;
    }
  },
  getGroup: async (groupId: string) => {
    try {
      return await prisma.group.findUniqueOrThrow({
        where: { id: groupId },
      });
    } catch (err) {
      throw err;
    }
  },
  getGroups: async (userId: string) => {
    try {
      // Since it is a side project, there will no much groups
      // So for now return all groups
      const records = await prisma.groupMember.findMany({
        where: { userId },
        select: { group: true },
      });

      return records.map((record) => record.group);
    } catch (err) {
      throw err;
    }
  },
};
