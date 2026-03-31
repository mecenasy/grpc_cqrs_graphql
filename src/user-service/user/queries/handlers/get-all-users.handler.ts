import { Inject } from '@nestjs/common';
import { QueryHandler } from '@nestjs/cqrs';
import { type ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { GrpcProxyKey, ProxyKey } from 'src/user-service/common/proxy/constance';
import { GetAllUsersQuery } from '../impl/get-all-users.query';
import { Handler } from 'src/user-service/common/handler/handler';
import { USER_PROXY_SERVICE_NAME, UserList, UserProxyServiceClient } from 'src/proto/user';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler extends Handler<GetAllUsersQuery, UserList, UserProxyServiceClient> {
  constructor(
    @Inject(GrpcProxyKey) public readonly grpcClient: ClientGrpc,
    @Inject(ProxyKey) public readonly client: ClientProxy,
  ) {
    super(USER_PROXY_SERVICE_NAME);
  }

  async execute() {
    return await lastValueFrom(this.gRpcService.getAllUsers({}));
  }
}
