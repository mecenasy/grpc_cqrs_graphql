import { Module } from '@nestjs/common';
import { UserGrpcController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserGrpcController],
})
export class GrpcModule {}
