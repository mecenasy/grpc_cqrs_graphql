import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
import { GrpcModule } from './grpc/grpc.module';

@Module({
  imports: [UserModule, CommonModule, GrpcModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
