import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { isEmpty, toNumber, without } from 'lodash';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  maxHttpBufferSize: 1e8,
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  @WebSocketServer() server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    const { query } = client.handshake;
    client.setMaxListeners(200);
    this.server.setMaxListeners(200);

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
          await this.cacheManager.set(idPublisher, filterResult, 0);
        }
      }
    }
  }
  async handleDisconnect(@ConnectedSocket() client: Socket) {
    //
    const { query } = client.handshake;
    const userId = query?.session as string;

    await this.cacheManager.del('undefined');
    if (userId !== null && userId !== 'undefined') {
      const listSocketId = await this.cacheManager.get<Array<string>>(userId);

      const removedList = without(listSocketId, client.id);
      if (isEmpty(removedList)) await this.cacheManager.del(userId);
      else await this.cacheManager.set(userId, removedList, 0);
    }
  }

  @SubscribeMessage('logout')
  async handleLogout(client: any) {
    const { query } = client.handshake;

    const userId = query?.session;

    await this.cacheManager.del(userId);
  }
}
