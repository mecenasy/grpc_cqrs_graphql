import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryUsersResolver } from './query-user.resolver';
import { CommandUsersResolver } from './command-user.resolver';
import { userCommands } from './commands/handlers';
import { userQueries } from './queries/handlers';

@Global()
@Module({
  imports: [CqrsModule],
  providers: [
    ...userCommands,
    ...userQueries,
    CommandUsersResolver,
    QueryUsersResolver,
  ],
})
export class UserModule {}
