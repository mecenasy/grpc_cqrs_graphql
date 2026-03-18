import { Inject, OnModuleInit } from '@nestjs/common';
import { ICommand } from '@nestjs/cqrs';
import { type ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { UserProxyServiceClient } from 'src/proto/user';
import { GrpcProxyKey, ProxyKey } from '../proxy/constance';
import { lastValueFrom, timeout } from 'rxjs';
import { RedisData, SaveRedisData } from '../redis/model/redis-data';
import { RedisEvent } from '../redis/model/redis-event';

export abstract class Handler<T extends ICommand, S> implements OnModuleInit {
  public gRpcService: UserProxyServiceClient;

  constructor(
    @Inject(GrpcProxyKey) public readonly grpcClient: ClientGrpc,
    @Inject(ProxyKey) public readonly client: ClientProxy,
  ) {}
  abstract execute(command: T): Promise<S>;

  onModuleInit() {
    this.gRpcService =
      this.grpcClient.getService<UserProxyServiceClient>('UserProxyService');
  }

  public async getFromCache<T>(data: RedisData): Promise<T | null> {
    return await lastValueFrom(
      this.client.send<T, RedisData>(RedisEvent.Get, data).pipe(timeout(5000)),
    );
  }

  public async saveInCache<T>(data: SaveRedisData<T>): Promise<void> {
    await lastValueFrom(
      this.client
        .send<object, SaveRedisData<T>>(RedisEvent.Save, data)
        .pipe(timeout(5000)),
    );
  }

  public async removeFromCache(data: RedisData): Promise<void> {
    await lastValueFrom(
      this.client
        .send<object, RedisData>(RedisEvent.Remove, data)
        .pipe(timeout(5000)),
    );
  }

  public createUserEvent<T>(user: T) {
    this.client.emit<object, T>('user_created', user);
  }
}
