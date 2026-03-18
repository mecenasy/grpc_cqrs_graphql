import { CommandHandler } from '@nestjs/cqrs';
import { DeleteUserCommand } from '../impl/delete-user.command';
import { Inject } from '@nestjs/common';
import { ClientProxy, type ClientGrpc } from '@nestjs/microservices';
import { GrpcProxyKey, ProxyKey } from 'src/common/proxy/constance';
import { firstValueFrom } from 'rxjs';
import { Handler } from 'src/common/handler/handler';
import type { UserIdentity } from 'src/proto/user';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler extends Handler<
  DeleteUserCommand,
  UserIdentity
> {
  constructor(
    @Inject(GrpcProxyKey) public readonly grpcClient: ClientGrpc,
    @Inject(ProxyKey) public readonly client: ClientProxy,
  ) {
    super(grpcClient, client);
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

    await this.removeFromCache({
      identifier: id,
      prefix: 'user',
    });

    return result;
  }
}
