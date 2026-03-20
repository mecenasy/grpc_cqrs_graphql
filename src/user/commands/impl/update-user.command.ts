import { Command } from '@nestjs/cqrs';
import { UserInfo } from 'src/proto/user';
import { UpdateUserType } from 'src/user/dto/update-user.type';

export class UpdateUserCommand extends Command<UserInfo> {
  constructor(public readonly user: UpdateUserType) {
    super();
  }
}
