import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { GrpcModule } from './user/grpc.module';

@Module({
  imports: [CommonModule, GrpcModule],
})
export class AppModule {}
