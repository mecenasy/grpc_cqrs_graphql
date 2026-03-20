import { Query } from '@nestjs/cqrs';
import { UserList } from 'src/proto/user';

export class SearchUserQuery extends Query<UserList> {
  constructor(public readonly query: string) {
    super();
  }
}
