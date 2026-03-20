import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { GetUserQuery } from './queries/impl/get-user.query';
import { UpdateUserCommand } from './commands/impl/update-user.command';
import { DeleteUserCommand } from './commands/impl/delete-user.command';
import { GetAllUsersQuery } from './queries/impl/get-all-users.query';
import { UserIdentityType } from './dto/user-identity.type';
import { UserType } from './dto/user.type';
import { UpdateUserType } from './dto/update-user.type';
import { CreateUserType } from './dto/create-user.type.';
import { SearchUserQuery } from './queries/impl/search-user.query';

@Resolver(() => UserType)
export class UsersResolver {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Query(() => UserType, { name: 'user' })
  async getUser(@Args('id', { type: () => ID }) id: string) {
    return this.queryBus.execute<GetUserQuery, UserType>(
      new GetUserQuery(id, '', ''),
    );
  }

  @Query(() => [UserType], { name: 'users' })
  async getAllUsers() {
    const result = await this.queryBus.execute<
      GetAllUsersQuery,
      { users: UserType[] }
    >(new GetAllUsersQuery());
    return result.users;
  }

  @Mutation(() => UserType)
  async createUser(@Args('input') input: CreateUserType) {
    return this.commandBus.execute<CreateUserCommand, UserType>(
      new CreateUserCommand(input),
    );
  }

  @Mutation(() => UserType)
  async updateUser(@Args('input') input: UpdateUserType) {
    return this.commandBus.execute<UpdateUserCommand, UserType>(
      new UpdateUserCommand(input),
    );
  }

  @Mutation(() => UserIdentityType)
  async deleteUser(
    @Args('id', { type: () => ID }) id: string,
    @Args('email') email: string,
    @Args('phone') phone: string,
  ) {
    const result = await this.commandBus.execute<
      DeleteUserCommand,
      UserIdentityType
    >(new DeleteUserCommand(id, email, phone));

    return result;
  }

  @Query(() => [UserType], { name: 'queryUsers' })
  async searchUsers(@Args('query') query: string) {
    const result = await this.queryBus.execute<
      SearchUserQuery,
      { users: UserType[] }
    >(new SearchUserQuery(query));
    return result.users;
  }
}
