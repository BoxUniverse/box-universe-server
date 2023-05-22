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
import { first, flattenDeep, isEmpty, toNumber, uniq } from 'lodash';
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
        message: {
          userAction: userRequest.id,
          userReceive: [userReceive.id],
        },
        type: 'request',
        action: 'accept-request',
      } as any),
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
    const { message, type, action } = payload;

    // const promises: Promise<any>[] = [
    //   this.notificationsService.getNotificationByPayload({
    //     type: type,
    //     action,
    //     message: message,
    //   } as any),
    // ];
    const receiver: string[] = [];
    let profiles: string[] = [];
    switch (type) {
      case 'newsfeed': {
        const post = message?.post;
        if (!post) throw new Error('missing post argument');
        //TODO: get list profile commented  post
        profiles = (await this.commentsService.getProfilesCommented(post)).profiles;
        // owner post
        profiles = [...profiles, ...message.userReceive];
        break;
      }
      case 'message': {
        const conversation = message?.conversation;

        if (!conversation) throw new Error('missing conversation argument');
        //TODO: get list profile of conversation
        profiles = (await this.conversationsService.getProfiles(conversation)).members;
        break;
      }
    }
    profiles = uniq(profiles);

    if (!isEmpty(profiles)) {
      try {
        const listPromises: Promise<any>[] = [];
        const [resultNotify, socketIds] = await Promise.all([
          this.notificationsService.notify({
            type,
            message: {
              ...payload.message,
              userAction: {
                id: payload.message.userAction.id,
                name: payload.message.userAction.name,
                email: payload.message.userAction.email,
                avatar: payload.message.userAction.avatar,
              },
              userReceive: profiles,
            },
            action,
          }),
          this.cacheHelpersService.getSocketIdsByProfiles(profiles),
        ]);

        receiver.push(...socketIds);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
    if (!isEmpty(receiver))
      client.to(receiver).emit('notifications.SEND_NOTIFICATION', {
        ...payload,
      });
    return null;
  }
}
