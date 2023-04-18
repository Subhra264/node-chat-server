import grpc from '@grpc/grpc-js';
import MessageService from '../../services/MessageService';
import { FriendMessageRequest__Output } from '../models/message/FriendMessageRequest';
import { FriendMessageResponse } from '../models/message/FriendMessageResponse';
import { GroupMessageRequest__Output } from '../models/message/GroupMessageRequest';
import { GroupMessageResponse } from '../models/message/GroupMessageResponse';

export default {
  saveFriendMessage: async (
    req: grpc.ServerUnaryCall<
      FriendMessageRequest__Output,
      FriendMessageResponse
    >,
    res: grpc.sendUnaryData<FriendMessageResponse>,
  ) => {
    try {
      const message = await MessageService.addFriendMessage({
        senderId: req.request.senderId as string,
        receiverId: req.request.recipentId as string,
        message: req.request.message as string,
        // encKey: req.request.encKey || ''
      });
      res(null, {
        status: 'success',
        message: message.timestamp.toISOString(),
      });
    } catch (err) {
      res({
        code: grpc.status.INTERNAL,
        message: (err as Error).message,
      });
    }
  },
  saveGroupMessage: async (
    req: grpc.ServerUnaryCall<
      GroupMessageRequest__Output,
      GroupMessageResponse
    >,
    res: grpc.sendUnaryData<GroupMessageResponse>,
  ) => {
    try {
      const groupMessage = await MessageService.addGroupMessage({
        groupId: req.request.groupId as string,
        channelId: req.request.channelId as string,
        userId: req.request.userId as string,
        message: req.request.message as string,
        encKey: req.request.encKey || '',
      });
      res(null, {
        status: 'success',
        message: groupMessage.timestamp.toISOString(),
      });
    } catch (err) {
      res({
        code: grpc.status.INTERNAL,
        message: (err as Error).message,
      });
    }
  },
};
