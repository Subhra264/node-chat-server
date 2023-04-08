import PrismaORM from '../init/prisma.init';
import HttpErrors from '../errors/http-errors';
import { ChannelType } from '@prisma/client';

interface CreateChannelProps {
  groupId: string;
  name: string;
  type: ChannelType;
  default?: boolean;
}

const prisma = PrismaORM.get();

export default {
  getAll: async (groupId: string) => {
    try {
      if (!groupId) throw HttpErrors.BadRequest();

      return await prisma.channel.findMany({
        where: {
          groupId,
        },
      });
    } catch (err) {
      throw err;
    }
  },
  create: async (props: CreateChannelProps) => {
    try {
      if (!props.groupId || !props.name) throw HttpErrors.BadRequest();

      props.default = props.default || false;
      return await prisma.channel.create({
        data: {
          ...props,
          default: props.default,
        },
      });
    } catch (err) {
      throw err;
    }
  },
};
