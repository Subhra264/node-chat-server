import redis, { RedisClient } from 'redis';
const redisURI = process.env.REDIS_URI;
const redisPwd = process.env.REDIS_PWD;

if (!redisURI && !redisPwd) {
    console.log('Invalid redis credentials!');
    process.exit();
}

const redisClient: string[] = (redisURI as string).split(':');

const pubClient: RedisClient = redis.createClient({
    host: redisClient[0],
    port: +redisClient[1],
    auth_pass: redisPwd
});

pubClient.on('error', (err: Error) => {
    console.log('Error connecting redis server:', err);
    process.exit();
});

pubClient.on('connect', () => {
    console.log('Connected to redis server...');
});

const subClient: RedisClient = pubClient.duplicate();




