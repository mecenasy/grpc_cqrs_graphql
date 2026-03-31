import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';

import { HttpModule } from '@nestjs/axios';
import { SignalBridgeService } from './signal.controler';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CsrfInterceptor } from './common/interceptors/csrf.interceptor';

@Module({
  imports: [HttpModule, UserModule, CommonModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CsrfInterceptor,
    },
    SignalBridgeService,
  ],
})
export class AppModule {}
