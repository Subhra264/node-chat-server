import { Socket } from 'socket.io';
import GRPCAuthClient from '../utils/GRPCAuthClient';

class ChatService {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
    this.init();
  }

  private init() {
    GRPCAuthClient.client.validateToken(this.socket.handshake.auth.token);
  }
}

export default ChatService;
