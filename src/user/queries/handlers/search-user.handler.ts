import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { type ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GrpcProxyKey, ProxyKey } from 'src/common/proxy/constance';
import { Handler } from 'src/common/handler/handler';
import type { UserList } from 'src/proto/user';
import { SearchUserQuery } from '../impl/search-user.query';

@QueryHandler(SearchUserQuery)
export class SearchUserHandler extends Handler<SearchUserQuery, UserList> {
  constructor(
    @Inject(GrpcProxyKey) public readonly grpcClient: ClientGrpc,
    @Inject(ProxyKey) public readonly client: ClientProxy,
  ) {
    super(grpcClient, client);
  }

  async execute({ query }: SearchUserQuery) {
    const users = await lastValueFrom(this.gRpcService.searchUsers({ query }));

    return users;
  }
}
