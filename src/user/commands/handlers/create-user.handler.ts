import { CommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from '../impl/create-user.command';
import { BadRequestException, Inject } from '@nestjs/common';
import { ClientProxy, type ClientGrpc } from '@nestjs/microservices';
import { GrpcProxyKey, ProxyKey } from 'src/common/proxy/constance';
import { lastValueFrom } from 'rxjs';
import { Handler } from 'src/common/handler/handler';
import type { UserInfo } from 'src/proto/user';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler extends Handler<CreateUserCommand, UserInfo> {
  constructor(
    @Inject(GrpcProxyKey) public readonly grpcClient: ClientGrpc,
    @Inject(ProxyKey) public readonly client: ClientProxy,
  ) {
    super(grpcClient, client);
  }

  async execute(command: CreateUserCommand) {
    const { user: userToCreate } = command;

    const { isValid, message } = await lastValueFrom(
      this.gRpcService.validateUser(userToCreate),
    );

    if (!isValid) {
      throw new BadRequestException(message);
    }

    const user = await lastValueFrom(this.gRpcService.createUser(userToCreate));

    await this.saveInCache({
      identifier: user.id,
      data: user,
      EX: 3600,
      prefix: 'user',
    });

    this.createUserEvent(user);

    return user;
  }
}
