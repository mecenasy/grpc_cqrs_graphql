import { Global, Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';
import { APP_GUARD } from '@nestjs/core';
import { UserController } from './user.controller';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { AuthGuard } from 'src/common/guards/user.guard';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User]), ProxyModule, ConfigModule],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
