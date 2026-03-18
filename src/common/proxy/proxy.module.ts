import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeConfigService } from '../../configs/types.config.service';
import { GrpcProxyKey, ProxyKey } from './constance';
import { RedisConfig } from 'src/common/redis/config/redis.config';
import { join } from 'path';

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
      {
        name: GrpcProxyKey,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: TypeConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'user',
            protoPath: join(__dirname, '../../../proto/user.proto'),
            // TODO: dodać do konfigu
            url: 'localhost:50051',
            onLoadPackageDefinition: (pkg, server) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-member-access
              new (require('@grpc/reflection').ReflectionService)(
                pkg,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              ).addToServer(server);
            },
          },
        }),
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
