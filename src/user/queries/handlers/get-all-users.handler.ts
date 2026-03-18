import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { type ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GrpcProxyKey, ProxyKey } from 'src/common/proxy/constance';
import { GetAllUsersQuery } from '../impl/get-all-users.query';
import { Handler } from 'src/common/handler/handler';
import type { UserList } from 'src/proto/user';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler extends Handler<GetAllUsersQuery, UserList> {
  constructor(
    @Inject(GrpcProxyKey) public readonly grpcClient: ClientGrpc,
    @Inject(ProxyKey) public readonly client: ClientProxy,
  ) {
    super(grpcClient, client);
  }

  async execute(query: GetAllUsersQuery) {
    const users = await lastValueFrom(this.gRpcService.getAllUsers({}));

    return users;
  }
}
