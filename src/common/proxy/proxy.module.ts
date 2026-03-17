import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeConfigService } from '../../configs/types.config.service';
import { ProxyKey } from './constance';
import { RedisConfig } from 'src/common/redis/config/redis.config';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: ProxyKey,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: TypeConfigService) => {
          const redisUri =
            configService.getOrThrow<RedisConfig>('redis')?.redisUri;
          const tls = redisUri.startsWith('rediss')
            ? { rejectUnauthorized: false }
            : undefined;

          return {
            transport: Transport.REDIS,
            options: {
              host: configService.get<RedisConfig>('redis')?.redisHost,
              port: +(configService.get<RedisConfig>('redis')?.redisPort ?? 0),
              password: configService.get<RedisConfig>('redis')?.redisPassword,
              tls,
            },
          };
        },
      },
    ]),
  ],
  exports: [ClientsModule],
  providers: [
    TypeConfigService,
    {
      provide: TypeConfigService,
      useExisting: ConfigService,
    },
  ],
})
export class ProxyModule {}
