import { Query } from '@nestjs/cqrs';
import { UserInfo } from 'src/proto/user';

export class GetUserQuery extends Query<UserInfo> {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly phone: string,
  ) {
    super();
  }
}
