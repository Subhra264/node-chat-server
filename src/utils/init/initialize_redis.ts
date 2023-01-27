import redis, { RedisClient } from 'redis';
import InitApp from './initialize_app';
import { createAdapter } from 'socket.io-redis';

const redisURI = process.env.REDIS_URI;
const redisPwd = process.env.REDIS_PWD;

if (!redisURI && !redisPwd) {
  console.log('Invalid redis credentials!');
  process.exit(5);
}

const redisClient: string[] = (redisURI as string).split(':');
if (redisClient.length !== 2) {
  console.log('Error with redis URI...');
  process.exit(5);
}

// Singleton pattern
class InitRedis {
  public pubClient: RedisClient;
  public subClient: RedisClient;
  private static redisClient_: InitRedis;

  // Don't let anyone instantiate it
  private constructor() {
    // The redis publisher client
    this.pubClient = redis.createClient({
      host: redisClient[0],
      port: +redisClient[1],
      auth_pass: redisPwd,
    });

    this.pubClient.on('error', (err: Error) => {
      console.error('Error connecting redis server:', err);
      process.exit(5);
    });

    this.pubClient.on('connect', () => {
      console.log('Connected to redis server...');
    });

    // Redis subscriber client
    this.subClient = this.pubClient.duplicate();

    // Create an adapter for the socket.io instance
    InitApp.app.io.adapter(
      createAdapter({
        pubClient: this.pubClient,
        subClient: this.subClient,
      }),
    );
  }

  // Initialize redis
  public static init(): void {
    if (!this.redisClient_) this.redisClient_ = new InitRedis();
  }

  // Get the Redis client
  public static get redisClient(): InitRedis {
    this.init();
    return this.redisClient_;
  }
}

export = InitRedis;
