import { Command } from '@nestjs/cqrs';
import { UserInfo } from 'src/proto/user';
import { CreateUserType } from 'src/user-service/user/dto/create-user.type.';

export class CreateUserCommand extends Command<UserInfo> {
  constructor(public readonly user: CreateUserType) {
    super();
  }
}
