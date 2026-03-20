import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { GetUserHandler } from './queries/handlers/get-user.handler';
import { GetAllUsersHandler } from './queries/handlers/get-all-users.handler';
import { SearchUserHandler } from './queries/handlers/search-user.handler';
import { CreateUserHandler } from './commands/handlers/create-user.handler';
import { UpdateUserHandler } from './commands/handlers/update-user.handler';
import { DeleteUserHandler } from './commands/handlers/delete-user.handler';
import { QueryUsersResolver } from './query-user.resolver';
import { CommandUsersResolver } from './command-user.resolver';

@Global()
@Module({
  imports: [CqrsModule],
  providers: [
    GetUserHandler,
    GetAllUsersHandler,
    SearchUserHandler,
    CreateUserHandler,
    UpdateUserHandler,
    DeleteUserHandler,
    CommandUsersResolver,
    QueryUsersResolver,
  ],
})
export class UserModule {}
