import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';

interface ServerToClientEvents {
  // TODO: List down all the events expected
}

interface ClientToServerEvents {
  // TODO: list down all client to server events expected
}

interface InterServerEvents {
  // TODO: List down all inter server events expected
}

interface SocketData {
  // TODO: Define all the required socket data
}

const httpServer = createServer();
const io = new SocketServer<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
>(httpServer);

// TODO: Is async ok to use?
io.on('connection', (socket) => {});
