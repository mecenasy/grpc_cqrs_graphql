import { GetUserHandler } from './get-user.handler';
import { GetAllUsersHandler } from './get-all-users.handler';
import { SearchUserHandler } from './search-user.handler';

export const userQueries = [GetUserHandler, GetAllUsersHandler, SearchUserHandler];
