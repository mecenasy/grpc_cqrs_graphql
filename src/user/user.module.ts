import { Global, Module } from '@nestjs/common';
import { UsersResolver } from './user.resolver';
import { GetUserHandler } from './queries/handlers/get-user.handler';
import { CreateUserHandler } from './commands/handlers/create-user.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateUserHandler } from './commands/handlers/update-user.handler';
import { DeleteUserHandler } from './commands/handlers/delete-user.handler';
import { GetAllUsersHandler } from './queries/handlers/get-all-users.handler';
import { SearchUserHandler } from './queries/handlers/search-user.handler';

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
    UsersResolver,
  ],
})
export class UserModule {}
