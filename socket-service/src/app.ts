import { createServer } from 'http';
import { SocketServer } from './utils/socketEvents';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { config } from 'dotenv';
import GRPCAuthClient from './grpc/GRPCAuthClient';
import authenticate from './middlewares/auth.middleware';

config();

const PORT = process.env.PORT || 5000;
const redisURI = process.env.REDIS_URI;
console.log('Redis uri', redisURI);

if (!redisURI) {
  console.log('Invalid redis credentials!');
  process.exit(5);
}

const httpServer = createServer();
const io = new SocketServer(httpServer, {
  cors: {
    origin: '*',
  },
});

const grpcAuth = GRPCAuthClient.client;
// Load GRPC protobufs and set up client for auth grpc server
grpcAuth.loadProto();

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
io.use(authenticate);

// TODO: Is async ok to use?
io.on('connection', async (socket) => {});

httpServer.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
