import { Resolver, Mutation, Args, ID } from '@nestjs/graphql';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from './commands/impl/create-user.command';
import { UpdateUserCommand } from './commands/impl/update-user.command';
import { DeleteUserCommand } from './commands/impl/delete-user.command';
import { UserIdentityType } from './dto/user-identity.type';
import { UserType } from './dto/user.type';
import { UpdateUserType } from './dto/update-user.type';
import { CreateUserType } from './dto/create-user.type.';

@Resolver(() => UserType)
export class CommandUsersResolver {
  constructor(private readonly commandBus: CommandBus) {}

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
}
