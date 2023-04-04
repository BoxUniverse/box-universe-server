import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Cache } from 'cache-manager';
import { toNumber, without } from 'lodash';
import { Server, Socket } from 'socket.io';
import { PostsService } from '@src/posts';

@WebSocketGateway({
  maxHttpBufferSize: 1e8,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
@Injectable()
export class PostsGateway {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('post.ADD')
  async handleSendMessage(
    @MessageBody() payload: { postAdded },
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const post = payload.postAdded;

    if (post?.profile) {
      const profile = post.profile;
      const friends = profile.friends;

      const receiverPacket = [];
      receiverPacket.push(...((await this.cacheManager.get<string[]>(profile.id)) || []));

      for (const p of friends) {
        receiverPacket.push(...((await this.cacheManager.get<string[]>(p.id)) || []));
      }
      without(receiverPacket, null);

      client.to(receiverPacket).emit('post.ADD', post);
    }
  }
}
