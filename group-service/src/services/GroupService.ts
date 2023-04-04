import PrismaORM from '../init/prisma.init';
import groupSchema, { GroupSchema } from '../utils/validateGroupSchema';
import convertToHttpErrorFrom from '../errors/errorsToHttpError';

const prisma = PrismaORM.get();

export default {
  createGroup: async (groupBody: GroupSchema, creator: string) => {
    try {
      const validatedGroup: GroupSchema = await groupSchema.validateAsync(
        groupBody,
      );

      const newGroup = await prisma.group.create({
        data: validatedGroup,
      });

      // TODO: Add Group creator as group member and create welcome channel through GRPC
      return newGroup;
    } catch (err) {
      throw convertToHttpErrorFrom(err);
    }
  },
  getGroups: async (userId: string) => {},
  getMembers: async (groupId: string) => {},
  createInvitation: async (groupId: string, userId: string) => {},
  joinGroup: async (groupId: string, userId: string) => {},
};
