import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { CacheTTL, CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { without } from 'lodash';
import { Server, Socket } from 'socket.io';
@WebSocketGateway(3005, { cors: true })
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  @WebSocketServer() server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    const { query } = client.handshake;

    const idPublisher: string = query?.session as string;
    await this.cacheManager.del('undefined');

    if (idPublisher !== null && idPublisher !== 'undefined') {
      const listSocketId = await this.cacheManager.get<Array<string>>(idPublisher);

      if (listSocketId === null) await this.cacheManager.set(idPublisher, [client.id]);
      else {
        // check and remove socketId invalid
        const filterResult = listSocketId.filter(
          (socketId) => this.server.sockets.sockets.get(socketId) !== undefined,
        );

        //persist socketId
        if (!filterResult.includes(client.id)) {
          filterResult.push(client.id);
          await this.cacheManager.set(idPublisher, filterResult, { ttl: 0 });
        }
      }
    }
  }
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    console.log('disconnect');
    const { query } = client.handshake;
    const userId = query?.session as string;

    await this.cacheManager.del('undefined');
    if (userId !== null && userId !== 'undefined') {
      const listSocketId = await this.cacheManager.get<Array<string>>(userId);

      const removedList = without(listSocketId, client.id);
      await this.cacheManager.set(userId, removedList, { ttl: 0 });
    }
  }

  @SubscribeMessage('logout')
  async handleLogout(client: any) {
    const { query } = client.handshake;

    const userId = query?.session;

    const result = await this.cacheManager.del(userId);
    await this.cacheManager.del(userId);

    const listSocketId = await this.cacheManager.get<Array<string>>(userId);
  }
}
