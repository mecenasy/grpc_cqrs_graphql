import { Module } from '@nestjs/common';
import { UserGrpcController } from './user.controller';
import { User } from 'src/user/entity/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserGrpcController],
})
export class GrpcModule {}
