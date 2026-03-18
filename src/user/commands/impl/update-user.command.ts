import { UpdateUserType } from 'src/user/dto/update-user.type';

export class UpdateUserCommand {
  constructor(public readonly user: UpdateUserType) {}
}
