import grpc from '@grpc/grpc-js';

export default {
  getMembersHandler: async (
    req: grpc.ServerUnaryCall<MembersRequest__Output, MembersResponse>,
    res: grpc.sendUnaryData<MembersResponse>,
  ) => {
    try {
      const members = await MemberService.getMembers(
        req.request.groupId as string,
      );
      res(null, {
        status: 'success',
        members,
      });
    } catch (err) {
      res({
        code: grpc.status.INTERNAL,
        message: (err as Error).message,
      });
    }
  },
  doesGroupExist: async (
    req: grpc.ServerUnaryCall<GroupExistRequest__Output, GroupExistResponse>,
    res: grpc.sendUnaryData<GroupExistResponse>,
  ) => {
    try {
      const group = await GroupService.getGroup(req.request.groupId as string);

      res(null, {
        status: 'success',
        doesExist: group ? true : false,
      });
    } catch (err) {
      res({
        code: grpc.status.INTERNAL,
        message: (err as Error).message,
      });
    }
  },
};
