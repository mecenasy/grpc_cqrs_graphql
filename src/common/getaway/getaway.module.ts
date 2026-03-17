import { Module } from '@nestjs/common';
import { AuthGetaway } from './getaway.getaway';

@Module({
  providers: [AuthGetaway],
  exports: [AuthGetaway],
})
export class GetawayModule {}
