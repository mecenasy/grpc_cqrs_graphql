import { Resolver, Query, Args, ID } from '@nestjs/graphql';
import { QueryBus } from '@nestjs/cqrs';
import { GetUserQuery } from './queries/impl/get-user.query';
import { GetAllUsersQuery } from './queries/impl/get-all-users.query';
import { SearchUserQuery } from './queries/impl/search-user.query';
import { UserType } from './dto/user.type';
import { ExcludeCsrf } from '../common/decorators/csrf.decorator';

@Resolver(() => UserType)
export class QueryUsersResolver {
  constructor(private readonly queryBus: QueryBus) {}

  @ExcludeCsrf()
  @Query(() => UserType, { name: 'user' })
  @ExcludeCsrf()
  async getUser(@Args('id', { type: () => ID }) id: string) {
    return this.queryBus.execute<GetUserQuery, UserType>(new GetUserQuery(id, '', ''));
  }

  @Query(() => [UserType], { name: 'users' })
  @ExcludeCsrf()
  async getAllUsers() {
    const result = await this.queryBus.execute<GetAllUsersQuery, { users: UserType[] }>(new GetAllUsersQuery());
    return result.users;
  }

  @Query(() => [UserType], { name: 'queryUsers' })
  @ExcludeCsrf()
  async searchUsers(@Args('query') query: string) {
    const result = await this.queryBus.execute<SearchUserQuery, { users: UserType[] }>(new SearchUserQuery(query));
    return result.users;
  }
}
