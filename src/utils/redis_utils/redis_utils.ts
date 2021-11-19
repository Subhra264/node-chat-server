import { RedisClient } from "redis";
import InitRedis from "../init/initialize_redis";

const redisClient: RedisClient = InitRedis.redisClient.pubClient;

interface Options {
    json?: boolean;
}

export async function get(key: string, options?: Options): Promise<any> {
    return new Promise((resolve) => {
        redisClient.get(key, (err, reply) => {
            // If some error occurs, no need to throw any error
            // Because caching is not mandatory for service
            if (err) {
                return resolve(null);
            }
            console.log('Redis get reply', reply);
            if (options?.json && reply) reply = JSON.parse(reply);

            resolve(reply);
        });
    });
}

export async function setex(key: string, value: any, seconds = 3600, options?: Options): Promise<boolean> {
    return new Promise((resolve) => {
        if (options?.json) value = JSON.stringify(value);
        redisClient.setex(key, seconds, value, (err, reply: string) => {
            // If some error occurs, no need to throw any error
            // Because caching is not mandatory for service
            if (err) {
                return resolve(false);
            }

            let success = false;
            console.log('Redis setex reply', reply);
            if (reply === 'OK') success = true;

            resolve(success);
        });
    });
}