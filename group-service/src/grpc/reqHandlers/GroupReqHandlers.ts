import grpc from '@grpc/grpc-js';
import { MembersRequest__Output } from '../models/group/MembersRequest';
import { MembersResponse } from '../models/group/MembersResponse';
import { GroupExistRequest__Output } from '../models/group/GroupExistRequest';
import { GroupExistResponse } from '../models/group/GroupExistResponse';

export default {
  getMembersHandler: async (
    req: grpc.ServerUnaryCall<MembersRequest__Output, MembersResponse>,
    res: grpc.sendUnaryData<MembersResponse>,
  ) => {
    try {
    } catch (err) {
      res({
        code: grpc.status.INTERNAL,
        message: (err as Error).message,
      });
    }
  },
  doesExist: async (
    req: grpc.ServerUnaryCall<GroupExistRequest__Output, GroupExistResponse>,
    res: grpc.sendUnaryData<GroupExistResponse>,
  ) => {
    try {
    } catch (err) {
      res({
        code: grpc.status.INTERNAL,
        message: (err as Error).message,
      });
    }
  },
};
