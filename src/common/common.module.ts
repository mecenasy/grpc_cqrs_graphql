import { Module } from '@nestjs/common';
import { PostgresModule } from './postgres/postgres.module';
import { RedisModule } from './redis/redis.module';
import { HttpModule } from '@nestjs/axios';
import { GetawayModule } from './getaway/getaway.module';
import { ConfigsModule } from 'src/configs/configs.module';
import { ProxyModule } from './proxy/proxy.module';
import { SessionModule } from './session/session.module';

@Module({
  imports: [
    PostgresModule,
    RedisModule,
    HttpModule,
    GetawayModule,
    ConfigsModule,
    ProxyModule,
    SessionModule,
  ],
})
export class CommonModule {}
