import { AuthGuard } from '@guards/auth.guard';
import { CACHE_MANAGER, Inject, Injectable, CacheTTL, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { RelationshipsService } from '@src/relationships/relationships.service';
import { Cache } from 'cache-manager';
import { Server, Socket } from 'socket.io';
import { ProfilesService } from './profiles.service';

@WebSocketGateway(3005, { cors: true })
@Injectable()
export class ProfilesGateway {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly profilesService: ProfilesService,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('publish.addFriend')
  async handleAddFriend(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const userRequest = payload?.userId;
    const userReceive = payload?.friendId;
    const listSocketId = await this.cacheManager.get<Array<string>>(userReceive);

    if (userRequest && userReceive) {
      // this.relationshipsService.addRelationship({
      //   userId: userRequest,
      //   friendId: userReceive,
      // });
      console.log('profiles ne');

      if (listSocketId) {
        const profile = await this.profilesService.getProfile({
          id: userRequest,
        });

        client.to(listSocketId).emit('subscribe.addFriend', {
          userRequest: {
            id: profile.id,
            name: profile.name,
          },
          userReceive: payload.friendId,
        });
      }
    }
  }

  @SubscribeMessage('subscribe/profiles.unfriend')
  async handleUnfriend(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { userId, friendId } = payload;
    const listSocketId = await this.cacheManager.get<Array<string>>(friendId);

    if (userId && friendId) {
      if (listSocketId) {
        client.to(listSocketId).emit('publish/profiles.unfriend', {
          userId: friendId,
          friendId: userId,
        });
      }
    }
  }
}
