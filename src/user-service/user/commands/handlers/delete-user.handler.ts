import { CommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../impl/delete-user.command';
import { Inject } from '@nestjs/common';
import { ClientProxy, type ClientGrpc } from '@nestjs/microservices';
import { GrpcProxyKey, ProxyKey } from 'src/user-service/common/proxy/constance';
import { firstValueFrom } from 'rxjs';
import { Handler } from 'src/user-service/common/handler/handler';
import { UserIdentity, UserProxyServiceClient } from 'src/proto/user';
import { USER_PROXY_SERVICE_NAME } from 'src/proto/user';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler extends Handler<DeleteUserCommand, UserIdentity, UserProxyServiceClient> {
  constructor(
    @Inject(GrpcProxyKey) public readonly grpcClient: ClientGrpc,
    @Inject(ProxyKey) public readonly client: ClientProxy,
  ) {
    super(USER_PROXY_SERVICE_NAME);
  }

  async execute(command: DeleteUserCommand) {
    const { id, email, phone } = command;

    const result = await firstValueFrom(
      this.gRpcService.deleteUser({
        id,
        email,
        phone,
      }),
    );

    await this.cache.removeFromCache({
      identifier: id,
      prefix: 'user',
    });

    return result;
  }
}
