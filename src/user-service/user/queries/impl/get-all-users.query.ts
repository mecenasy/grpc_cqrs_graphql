import { Query } from '@nestjs/cqrs';
import { UserList } from 'src/proto/user';

export class GetAllUsersQuery extends Query<UserList> {}
