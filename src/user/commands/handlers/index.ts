import { CreateUserHandler } from './create-user.handler';
import { UpdateUserHandler } from './update-user.handler';
import { DeleteUserHandler } from './delete-user.handler';

export const userCommands = [
  CreateUserHandler,
  UpdateUserHandler,
  DeleteUserHandler,
];
