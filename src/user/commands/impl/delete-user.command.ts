import { Command } from '@nestjs/cqrs';
import { UserIdentity } from 'src/proto/user';

export class DeleteUserCommand extends Command<UserIdentity> {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly phone: string,
  ) {
    super();
  }
}
