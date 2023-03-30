import { Server, Socket } from 'socket.io';

export interface ServerToClientEvents {
  // TODO: List down all the events expected
  notification: () => void;
}

export interface ClientToServerEvents {
  // TODO: list down all client to server events expected
  join_app: () => void;
  join_group: () => void;
  join_voice: () => void;

  create_channel: () => void;
  message_channel: () => void;

  message_friend: () => void;
}

export interface InterServerEvents {
  // TODO: List down all inter server events expected
}

export interface SocketData {
  // TODO: Define all the required socket data
}

export class SocketServer extends Server<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
> {}

export type IoSocket = Socket<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
>;

// export function createSocketServer()
