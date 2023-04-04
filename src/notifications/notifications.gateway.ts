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
import { flattenDeep, isEmpty, toNumber } from 'lodash';
import { NotificationsService } from '@src/notifications/notifications.service';
import { CommentsService } from '@src/comments';
import { ConversationsService } from '@src/conversations';
import { CacheHelpersService } from '@helpers/cache';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
@Injectable()
export class NotificationsGateway {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly cacheHelpersService: CacheHelpersService,
    private readonly notificationsService: NotificationsService,
    private readonly commentsService: CommentsService,
    private readonly conversationsService: ConversationsService,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('subscribe/notifications.SEND_NOTIFICATION_REQUEST')
  async handleSendNotificationRequest(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const request = payload.request;
    const userRequest = request.userRequest;
    const userReceive = request.userReceive;

    const message = `${userRequest.name} has already ${request.type} request add friend`;
    const [listSocketId, resultNotify] = await Promise.all([
      this.cacheManager.get<Array<string>>(userRequest.id),
      this.notificationsService.notify({
        profile: userReceive,
        body: message,
        type: 'messaging',
      }),
    ]);

    if (userRequest && userReceive) {
      if (listSocketId) {
        client.to(listSocketId).emit('publish/notifications.SEND_NOTIFICATION_REQUEST', {
          userRequest,
          userReceive,
          message,
          type: `${request.type === 'accepted' ? 'success' : 'error'}`,
        });
      }
    }
  }

  @SubscribeMessage('notifications.SEND_NOTIFICATION')
  async handleSendNotification(@MessageBody() payload: any, @ConnectedSocket() client: Socket) {
    const { message, type } = payload;

    const receiver: string[] = [];
    let profiles: string[] = [];
    switch (type) {
      case 'newsfeed': {
        const { post } = payload;
        //TODO: get list profile commented  post
        const profilesCommented = await this.commentsService.getProfilesCommented(post);
        profiles = profilesCommented.profiles;
        break;
      }
      case 'message': {
        const { conversation } = payload;
        //TODO: get list profile of conversation
        profiles = (await this.conversationsService.getProfiles(conversation)).members;
        break;
      }
    }
    if (!isEmpty(profiles))
      receiver.push(...(await this.cacheHelpersService.getSocketIdsByProfiles(profiles)));
    if (!isEmpty(receiver))
      client.to(receiver).emit('notifications.SEND_NOTIFICATION', {
        ...payload,
      });
    return null;
  }
}
