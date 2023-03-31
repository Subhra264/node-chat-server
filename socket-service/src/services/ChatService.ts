import {
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
    socket.on('join_group', async () => this.joinGroup(socket));
    socket.on('join_voice', async () => this.joinVoice(socket));

    socket.on('create_channel', async () => this.createChannel(socket));

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
    // TODO: Join App
  }

  private async joinGroup(socket: IoSocket) {
    // TODO: Join Group
  }

  private async joinVoice(socket: IoSocket) {
    // TODO: Join Voice and notify group members
  }

  private async createChannel(socket: IoSocket) {
    // TODO: Create channel and notify group members
  }

  private onDisconnect(socket: IoSocket) {
    UserSocketMap.deleteUser(socket.userId as string);
  }
}

export default ChatService;
