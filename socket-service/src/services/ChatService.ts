import GRPCGroupClient from '../grpc/GRPCGroupClient';
import GRPCMessageClient from '../grpc/GRPCMessageClient';
import {
  CreateChannelEvent,
  DirectMessage,
  GroupMessage,
  IoSocket,
  SocketServer,
} from '../utils/socketEvents';
import UserSocketMap from '../utils/UserSocketMap';

class ChatService {
  private io: SocketServer;

  constructor(io: SocketServer) {
    this.io = io;
  }

  public init() {
    this.io.on('connection', async (socket) => this.initSocket(socket));
    // io.on('disconnection', async socket => this.onDisconnect(socket));
  }

  private initSocket(socket: IoSocket) {
    socket.on('message_channel', async (msg) =>
      this.messageChannel(socket, msg),
    );
    socket.on('message_friend', async (msg) => this.messageFriend(socket, msg));

    socket.on('join_app', async () => this.joinApp(socket));
    socket.on('join_group', async (groupId) => this.joinGroup(socket, groupId));
    socket.on('join_voice', async (groupId) => this.joinVoice(socket, groupId));

    socket.on('create_channel', async (ev) => this.createChannel(socket, ev));

    socket.on('disconnect', async () => this.onDisconnect(socket));

    UserSocketMap.putSocket(socket.userId as string, socket.id);
  }

  private async messageChannel(
    socket: IoSocket,
    { tempId, ...msg }: GroupMessage,
  ) {
    try {
      const messageRes = await GRPCMessageClient.client.saveGroupMessage({
        groupId: msg.groupId,
        channelId: msg.textChannel,
        message: msg.text,
        userId: socket.userId,
      });
      socket.emit('group_message_saved', {
        tempId,
        timestamp: messageRes.message as string,
        ...msg,
      });
      const res = await GRPCGroupClient.client.getMembers(msg.groupId);
      const socketIds = UserSocketMap.getSocketIdsForUsers(res.members || []);
      this.io.to(socketIds).emit('notification_groupMessage', {
        ...msg,
        fromUserId: socket.userId as string,
      });
    } catch (err) {
      console.log('Error saving message', err);
      socket.emit('group_message_not_saved', { tempId, ...msg });
    }
  }

  private async messageFriend(socket: IoSocket, msg: DirectMessage) {
    try {
      const messageRes = await GRPCMessageClient.client.saveFriendMessage({
        senderId: socket.userId,
        recipentId: msg.toUserId,
        message: msg.text,
      });
      socket.emit('friend_message_saved', {
        timestamp: messageRes.message as string,
        ...msg,
      });
      if (UserSocketMap.isUserPresent(msg.toUserId)) {
        const toSocketId = UserSocketMap.getSocketId(msg.toUserId);
        this.io.to(toSocketId).emit('notification_dm', {
          fromUserId: socket.userId as string,
          text: msg.text,
        });
      }
    } catch (err) {
      socket.emit('friend_message_not_saved', msg);
    }
  }

  private async joinApp(socket: IoSocket) {
    // TODO: Is needed at all?
  }

  private async joinGroup(socket: IoSocket, groupId: string) {
    // User must join the group through the REST API only
    // After that is successful, then only this event should be triggered
    let members: Array<string> = [];
    try {
      const data = await GRPCGroupClient.client.getMembers(groupId);
      if (data.members) members = data.members;
    } catch (err) {
      // Don't have to do anything, this is not a required event
      // So no need to send any information back to the client
    }
    const socketIds = UserSocketMap.getSocketIdsForUsers([]);
    this.io.to(socketIds).emit('new_member', {
      userId: socket.userId as string,
      username: socket.username as string,
      groupId,
    });
  }

  // For now, only one voice channel for each group
  private async joinVoice(socket: IoSocket, groupId) {
    // Since it is possible only when the socket connection is established,
    // no involvement of REST APIs required and all can be handled volatilely
    // TODO: If no existing Voice session, create one, and add this user
    const socketIds = UserSocketMap.getSocketIdsForUsers([]);
    this.io.to(socketIds).emit('joined_voice', {
      userId: socket.userId as string,
      username: socket.username as string,
      groupId,
    });
  }

  private async createChannel(socket: IoSocket, ev: CreateChannelEvent) {
    // The channel must be previously created through the REST API
    // After this is done, then only create_channel event should
    // get triggered with the generated id
    let members: Array<string> = [];
    try {
      const data = await GRPCGroupClient.client.getMembers(ev.groupId);
      if (data.members) members = data.members;
    } catch (err) {
      // Don't have to do anything, this is not a required event
      // So no need to send any information back to the client
    }
    const socketIds = UserSocketMap.getSocketIdsForUsers([]);
    this.io.to(socketIds).emit('new_channel', {
      userId: socket.userId as string,
      username: socket.username as string,
      ...ev,
    });
  }

  private onDisconnect(socket: IoSocket) {
    UserSocketMap.deleteUser(socket.userId as string);
  }
}

export default ChatService;
