import { Inject, NotFoundException } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { type ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GrpcProxyKey, ProxyKey } from 'src/user-service/common/proxy/constance';
import { GetUserQuery } from '../impl/get-user.query';
import { Handler } from 'src/user-service/common/handler/handler';
import { USER_PROXY_SERVICE_NAME, UserInfo, UserProxyServiceClient } from 'src/proto/user';

@QueryHandler(GetUserQuery)
export class GetUserHandler extends Handler<GetUserQuery, UserInfo, UserProxyServiceClient> {
  constructor(
    @Inject(GrpcProxyKey) public readonly grpcClient: ClientGrpc,
    @Inject(ProxyKey) public readonly client: ClientProxy,
  ) {
    super(USER_PROXY_SERVICE_NAME);
  }

  async execute(query: GetUserQuery) {
    const cachedUser = await this.cache.getFromCache<UserInfo>({
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
      await this.cache.saveInCache({
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
