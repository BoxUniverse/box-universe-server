import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';

import { Cache } from 'cache-manager';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3005, { cors: true })
@Injectable()
export class NotificationsGateway {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('subscribe/notifications.SEND_NOTIFICATION')
  async handleSendNotification(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const request = payload.request;
    const userRequest = request.userRequest;
    const userReceive = request.userReceive;
    const listSocketId = await this.cacheManager.get<Array<string>>(userRequest.id);

    if (userRequest && userReceive) {
      if (listSocketId) {
        client.to(listSocketId).emit('publish/notifications.SEND_NOTIFICATION', {
          userRequest,
          userReceive,
          message: `${userRequest.name} has already ${request.type} request add friend`,
          type: `${request.type === 'accepted' ? 'success' : 'error'}`,
        });
      }
    }
  }
}
