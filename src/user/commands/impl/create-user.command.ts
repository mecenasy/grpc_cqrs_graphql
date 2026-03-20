import { CreateUserType } from 'src/user/dto/create-user.type.';

export class CreateUserCommand {
  constructor(public readonly user: CreateUserType) {}
}
