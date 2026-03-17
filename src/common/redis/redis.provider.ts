/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createClient } from 'redis';
import { config } from 'dotenv';

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
config();

interface SocketOption {
  tls: true;
  rejectUnauthorized: boolean;
}

export const REDIS_CLIENT = Symbol('REDIS_CLIENT');

export const redisProvider = {
  provide: REDIS_CLIENT,
  useFactory: async () => {
    const redisUri = process.env.REDIS_URL?.trim();

    if (!redisUri) {
      console.error(
        '❌ [RedisProvider] REDIS_URL is missing in environment variables!',
      );
      throw new Error('Environment variable REDIS_URL is not defined');
    }

    const isTls = redisUri.startsWith('rediss');
    const socketOptions: SocketOption = {
      tls: true,
      rejectUnauthorized: false,
    };

    const client = createClient({
      url: redisUri,
      socket: isTls ? socketOptions : undefined,
    });

    client.on('error', (err) => {
      console.error('❌ [RedisProvider] Client Error:', err.message);
    });

    try {
      await client.connect();
      console.log(
        '✅ [RedisProvider] Connected successfully to:',
        redisUri.split('@')[1],
      );
      return client;
    } catch (error) {
      console.error('❌ [RedisProvider] Connection failed:', error.message);
      throw error;
    }
  },
};
