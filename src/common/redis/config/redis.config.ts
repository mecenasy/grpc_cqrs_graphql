import { registerAs } from '@nestjs/config';

export interface RedisConfig {
  redisPassword: string;
  redisHost: string;
  redisPort: string;
  redisUri: string;
}

export const redisConfig = registerAs(
  'redis',
  (): RedisConfig => ({
    redisPassword: process.env.REDIS_PASSWORD ?? '',
    redisHost: process.env.REDIS_HOST ?? '',
    redisPort: process.env.REDIS_PORT ?? '',
    redisUri: process.env.REDIS_URL ?? '',
  }),
);
