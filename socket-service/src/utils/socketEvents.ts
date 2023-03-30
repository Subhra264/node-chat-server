import { Server, Socket } from 'socket.io';

// >>>>>>>>>>>>>>>>>>>>>>>>>> ClientToServer >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

interface Message {
  text: string;
}

export interface GroupMessage extends Message {
  groupId: string;
  textChannel: string;
}

export interface DirectMessage extends Message {
  toUserId: string;
}

export interface CreateChannelEvent {
  groupId: string;
  channelId: string;
  channelName: string;
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<< ClientToServer <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

// >>>>>>>>>>>>>>>>>>>>>>>>>>> ServerToClient >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

export interface NotificationDM extends Message {
  fromUserId: string;
}

export interface NotificationGroupMessage extends GroupMessage {
  fromUserId: string;
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<< ServerToClient <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

export interface ServerToClientEvents {
  // TODO: List down all the events expected
  notification_general: () => void;
  notification_dm: (msg: NotificationDM) => void;
  notification_groupMessage: (msg: NotificationGroupMessage) => void;

  new_channel: () => void;
  joined_voice: () => void;
}

export interface ClientToServerEvents {
  // TODO: list down all client to server events expected
  join_app: () => void;
  join_group: () => void;
  join_voice: () => void;

  create_channel: () => void;
  message_channel: (msg: GroupMessage) => void;

  message_friend: (msg: DirectMessage) => void;
}

export interface InterServerEvents {
  // TODO: List down all inter server events expected
}

export interface SocketData {
  // TODO: Define all the required socket data
}

export class SocketServer extends Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> {}

export type IoSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> & { userId?: string; username?: string };

// export function createSocketServer()
