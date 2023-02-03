import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ProfilesService } from '@profiles/profiles.service';
import { Cache } from 'cache-manager';
import { Server, Socket } from 'socket.io';
import { RequestsService } from './requests.service';

@WebSocketGateway(3005, { cors: true })
@Injectable()
export class RequestsGateway {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly requestsService: RequestsService,
    private readonly profilesService: ProfilesService,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('subscribe/requests.SEND_REQUEST')
  async handleAddFriend(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userRequest = payload?.userId;
    const userReceive = payload?.friendId;
    const listSocketId = await this.cacheManager.get<Array<string>>(userReceive);

    if (userRequest && userReceive) {
      const request = await this.requestsService.addRequest({
        userRequest,
        userReceive,
      });

      if (listSocketId) {
        const userRequest = await this.profilesService.getProfile({
          id: payload.userId,
        });

        client.to(listSocketId).emit('publish/requests.SEND_REQUEST', {
          userRequest,
          userReceive: payload.friendId,
          _id: request._id,
          message: `${userRequest.name} has already sent request add friend !`,
        });
      }
    }
  }
}
