import redis, { RedisClient } from 'redis';
import { io } from './initialize_app';
import { createAdapter } from 'socket.io-redis';

const redisURI = process.env.REDIS_URI;
const redisPwd = process.env.REDIS_PWD;

if (!redisURI && !redisPwd) {
    console.log('Invalid redis credentials!');
    process.exit(5);
}

const redisClient: string[] = (redisURI as string).split(':');

const pubClient: RedisClient = redis.createClient({
    host: redisClient[0],
    port: +redisClient[1],
    auth_pass: redisPwd
});

pubClient.on('error', (err: Error) => {
    console.error('Error connecting redis server:', err);
    process.exit(5);
});

pubClient.on('connect', () => {
    console.log('Connected to redis server...');
});

const subClient: RedisClient = pubClient.duplicate();

io.adapter(createAdapter({
    pubClient,
    subClient
}));

export {};
