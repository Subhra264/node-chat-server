import { ExtendedError } from 'socket.io/dist/namespace';
import GRPCAuthClient from '../grpc/GRPCAuthClient';
import { IoSocket } from '../utils/socketEvents';

export default async function authenticate(
  socket: IoSocket,
  next: (err?: ExtendedError) => void,
) {
  try {
    const token = socket.handshake.auth.token;
    const response = await GRPCAuthClient.client.validateToken(token);
    socket.userId = response.userId;
    socket.username = response.username;
    next();
  } catch (err) {
    next(err as Error);
  }
}
