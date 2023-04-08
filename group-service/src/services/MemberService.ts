import PrismaORM from '../init/prisma.init';
import { TokenKeyType, signJWTToken, verifyToken } from '../utils/jwt';
import HttpErrors from '../errors/http-errors';

const prisma = PrismaORM.get();

export default {
  getMembers: async (groupId: string) => {
    try {
      const records = await prisma.groupMember.findMany({
        where: {
          groupId,
        },
      });

      return records.map((record) => record.userId);
    } catch (err) {
      throw err;
    }
  },
  createInvitation: async (groupId: string, userId: string) => {
    try {
      const groupInvitationPayload = {
        groupId,
        userId,
      };

      const groupMemberShip = await prisma.groupMember.findFirst({
        where: groupInvitationPayload,
      });

      if (!groupMemberShip) throw HttpErrors.BadRequest();
      const groupInvitationToken = signJWTToken(
        groupInvitationPayload,
        TokenKeyType.JWT_GROUP_INVITATION_KEY,
      );
      return {
        inviteToken: groupInvitationToken,
      };
    } catch (err) {
      throw err;
    }
  },
  joinGroup: async (token: string) => {
    try {
      if (!token) throw HttpErrors.BadRequest();
      const payload = await verifyToken(
        token,
        TokenKeyType.JWT_GROUP_INVITATION_KEY,
      );

      return await prisma.groupMember.create({
        data: {
          groupId: payload.groupId as string,
          userId: payload.userId as string,
        },
      });
    } catch (err) {
      throw err;
    }
  },
};
