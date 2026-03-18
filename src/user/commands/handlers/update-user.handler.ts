import { CommandHandler } from '@nestjs/cqrs';
import { UpdateUserCommand } from '../impl/update-user.command';
import { BadRequestException, Inject } from '@nestjs/common';
import { ClientProxy, type ClientGrpc } from '@nestjs/microservices';
import { GrpcProxyKey, ProxyKey } from 'src/common/proxy/constance';
import { lastValueFrom } from 'rxjs';
import { Handler } from 'src/common/handler/handler';
import type { UserInfo } from 'src/proto/user';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler extends Handler<UpdateUserCommand, UserInfo> {
  constructor(
    @Inject(GrpcProxyKey) public readonly grpcClient: ClientGrpc,
    @Inject(ProxyKey) public readonly client: ClientProxy,
  ) {
    super(grpcClient, client);
  }

  async execute(command: UpdateUserCommand) {
    const { user: userToUpdate } = command;

    const { isValid, message } = await lastValueFrom(
      this.gRpcService.validateUser(userToUpdate),
    );

    if (!isValid) {
      throw new BadRequestException(message);
    }

    const user = await lastValueFrom(this.gRpcService.updateUser(userToUpdate));

    await this.saveInCache({
      identifier: user.id,
      data: user,
      EX: 3600,
      prefix: 'user',
    });

    return user;
  }
}
