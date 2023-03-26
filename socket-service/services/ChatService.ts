import { Socket } from 'socket.io';

class ChatService {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
    this.init();
  }

  private init() {}
}

export default ChatService;
