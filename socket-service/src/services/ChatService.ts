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

  private async messageChannel(socket: IoSocket, msg: GroupMessage) {
    // TODO: Get group member ids
    const socketIds = UserSocketMap.getSocketIdsForUsers([]);
    this.io.to(socketIds).emit('notification_groupMessage', {
      ...msg,
      fromUserId: socket.userId as string,
    });

    // TODO: Save the message in group
  }

  private async messageFriend(socket: IoSocket, msg: DirectMessage) {
    if (UserSocketMap.isUserPresent(msg.toUserId)) {
      const toSocketId = UserSocketMap.getSocketId(msg.toUserId);
      this.io.to(toSocketId).emit('notification_dm', {
        fromUserId: socket.userId as string,
        text: msg.text,
      });
    }

    // TODO: Save the msg to database through GRPC
  }

  private async joinApp(socket: IoSocket) {
    // TODO: Is needed at all?
  }

  private async joinGroup(socket: IoSocket, groupId: string) {
    // User must join the group through the REST API only
    // After that is successful, then only this event should be triggered
    // TODO: Get the rest of the group members and notify them
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
    // TODO: Get the group members
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
