import { Inject, NotFoundException } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { type ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GrpcProxyKey, ProxyKey } from 'src/common/proxy/constance';
import { GetUserQuery } from '../impl/get-user.query';
import { Handler } from 'src/common/handler/handler';
import type { UserInfo } from 'src/proto/user';

@QueryHandler(GetUserQuery)
export class GetUserHandler extends Handler<GetUserQuery, UserInfo> {
  constructor(
    @Inject(GrpcProxyKey) public readonly grpcClient: ClientGrpc,
    @Inject(ProxyKey) public readonly client: ClientProxy,
  ) {
    super(grpcClient, client);
  }

  async execute(query: GetUserQuery) {
    const cachedUser = await this.getFromCache<UserInfo>({
      identifier: query.userId,
      prefix: 'user',
    });

    if (cachedUser) {
      return cachedUser;
    }

    const user = await lastValueFrom(
      this.gRpcService.getUser({
        id: query.userId,
        email: query.email,
        phone: query.phone,
      }),
    );

    if (user) {
      await this.saveInCache({
        identifier: user.id,
        data: user,
        EX: 3600,
        prefix: 'user',
      });
    }

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
