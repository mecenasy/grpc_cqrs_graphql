import { INestApplication } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { TypeConfigService } from '../../configs/types.config.service';
import { RedisConfig } from 'src/common/redis/config/redis.config';
import { join } from 'path';

export const initProxy = async (app: INestApplication) => {
  const config = app.get(TypeConfigService);
  const redisUri = app
    .get(TypeConfigService)
    ?.getOrThrow<RedisConfig>('redis')?.redisUri;
  const tls = redisUri.startsWith('rediss')
    ? { rejectUnauthorized: false }
    : undefined;
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.REDIS,
    options: {
      host: config.getOrThrow<RedisConfig>('redis')?.redisHost,
      port: +(config.getOrThrow<RedisConfig>('redis')?.redisPort ?? 0),
      password: config.getOrThrow<RedisConfig>('redis')?.redisPassword,
      tls,
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(__dirname, '../../../proto/user.proto'),
      url: 'localhost:50051',
    },
  });

  await app.startAllMicroservices().catch((err) => {
    console.error('BŁĄD POŁĄCZENIA Z REDISEM:', err);
  });
};
