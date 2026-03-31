import { CommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../impl/create-user.command';
import { BadRequestException, Inject } from '@nestjs/common';
import { ClientProxy, type ClientGrpc } from '@nestjs/microservices';

import { lastValueFrom } from 'rxjs';
import { GrpcProxyKey, ProxyKey } from '../../../common/proxy/constance';
import { Handler } from '../../../common/handler/handler';
import { UserInfo, UserProxyServiceClient, USER_PROXY_SERVICE_NAME } from 'src/proto/user';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler extends Handler<CreateUserCommand, UserInfo, UserProxyServiceClient> {
  constructor(
    @Inject(GrpcProxyKey) public readonly grpcClient: ClientGrpc,
    @Inject(ProxyKey) public readonly client: ClientProxy,
  ) {
    super(USER_PROXY_SERVICE_NAME);
  }

  async execute(command: CreateUserCommand) {
    const { user: userToCreate } = command;

    const { isValid, message } = await lastValueFrom(this.gRpcService.validateUser(userToCreate));

    if (!isValid) {
      throw new BadRequestException(message);
    }

    const user = await lastValueFrom(this.gRpcService.createUser(userToCreate));

    await this.cache.saveInCache({
      identifier: user.id,
      data: user,
      EX: 3600,
      prefix: 'user',
    });

    this.createEvent('user_created', user);

    return user;
  }
}
