import { CreateUserType } from 'src/user/dto/update-user.type copy';

export class CreateUserCommand {
  constructor(public readonly user: CreateUserType) {}
}
