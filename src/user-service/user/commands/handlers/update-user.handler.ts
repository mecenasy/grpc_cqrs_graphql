import { CommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../impl/update-user.command';
import { BadRequestException, Inject } from '@nestjs/common';
import { ClientProxy, type ClientGrpc } from '@nestjs/microservices';
import { GrpcProxyKey, ProxyKey } from 'src/user-service/common/proxy/constance';
import { lastValueFrom } from 'rxjs';
import { Handler } from 'src/user-service/common/handler/handler';
import { USER_PROXY_SERVICE_NAME, UserInfo, UserProxyServiceClient } from 'src/proto/user';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler extends Handler<UpdateUserCommand, UserInfo, UserProxyServiceClient> {
  constructor(
    @Inject(GrpcProxyKey) public readonly grpcClient: ClientGrpc,
    @Inject(ProxyKey) public readonly client: ClientProxy,
  ) {
    super(USER_PROXY_SERVICE_NAME);
  }

  async execute(command: UpdateUserCommand) {
    const { user: userToUpdate } = command;

    const { isValid, message } = await lastValueFrom(this.gRpcService.validateUser(userToUpdate));

    if (!isValid) {
      throw new BadRequestException(message);
    }

    const user = await lastValueFrom(this.gRpcService.updateUser(userToUpdate));

    await this.cache.saveInCache({
      identifier: user.id,
      data: user,
      EX: 3600,
      prefix: 'user',
    });

    return user;
  }
}
