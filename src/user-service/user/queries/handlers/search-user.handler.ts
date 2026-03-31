import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { type ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GrpcProxyKey, ProxyKey } from 'src/user-service/common/proxy/constance';
import { Handler } from 'src/user-service/common/handler/handler';
import { SearchUserQuery } from '../impl/search-user.query';
import { USER_PROXY_SERVICE_NAME, UserList, UserProxyServiceClient } from 'src/proto/user';

@QueryHandler(SearchUserQuery)
export class SearchUserHandler extends Handler<SearchUserQuery, UserList, UserProxyServiceClient> {
  constructor(
    @Inject(GrpcProxyKey) public readonly grpcClient: ClientGrpc,
    @Inject(ProxyKey) public readonly client: ClientProxy,
  ) {
    super(USER_PROXY_SERVICE_NAME);
  }

  async execute({ query }: SearchUserQuery) {
    const users = await lastValueFrom(this.gRpcService.searchUsers({ query }));

    return users;
  }
}
