import { createServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { config } from 'dotenv';

config();

const PORT = process.env.PORT || 5000;
const redisURI = process.env.REDIS_URI;
console.log('Redis uri', redisURI);

if (!redisURI) {
  console.log('Invalid redis credentials!');
  process.exit(5);
}

interface ServerToClientEvents {
  // TODO: List down all the events expected
  notification: () => void;
}

interface ClientToServerEvents {
  // TODO: list down all client to server events expected
  join_app: () => void;
  join_group: () => void;
  join_voice: () => void;

  create_channel: () => void;
  message_channel: () => void;

  message_friend: () => void;
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
>(httpServer, {
  cors: {
    origin: '*',
  },
});

const pubClient = createClient({
  url: redisURI,
});

pubClient.on('error', (err: Error) => {
  console.error('Error connecting redis server:', err);
  process.exit(5);
});

pubClient.on('connect', () => {
  console.log('Connected to redis server...');
});

const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));

// TODO: Is async ok to use?
io.on('connection', async (socket) => {});

httpServer.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
