import { CACHE_MANAGER, forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Conversation, ConversationsService } from '@src/conversations';
import { Profile, ProfilesService } from '@src/profiles';
import { Cache } from 'cache-manager';
import { isEmpty, uniq } from 'lodash';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3005, { cors: true })
@Injectable()
export class ConversationsGateway {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    @Inject(forwardRef(() => ProfilesService)) private profilesService: ProfilesService,
    private conversationsService: ConversationsService,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('conversation.addMember')
  async addMember(@MessageBody() payload, @ConnectedSocket() client: Socket) {
    const { profileId, conversationId, invitorId } = payload;

    if (profileId && conversationId && invitorId) {
      //

      const promises = [
        this.conversationsService.getConversationByIdNoRef(conversationId),

        this.profilesService.getProfile({
          id: profileId,
        }),
      ];

      const result = await Promise.all(promises);
      const conversation: Conversation = (result[0] as Conversation) || null;
      const profile: Profile = (result[1] as Profile) || null;
      if (conversation && profile) {
        let listSocketId = [];
        const { members } = conversation;

        for (const member of members) {
          const temp = (await this.cacheManager.get<string[]>(member as string)) || [];
          listSocketId.push(...temp);
        }

        const profileSocketIds = (await this.cacheManager.get<string[]>(profileId)) || [];
        const senderSocketIds = (await this.cacheManager.get<string[]>(invitorId)) || [];

        // senderSocketIds = senderSocketIds.filter((socketId) => socketId !== client.id);

        listSocketId.push(...senderSocketIds, ...profileSocketIds);
        listSocketId = uniq(listSocketId);

        if (!isEmpty(listSocketId)) {
          this.server.to(listSocketId).emit('publish/conversation.addMember', {
            conversation,
            profile,
            invitorId,
          });
        }
      }
    }

    // if (!conversation.members) return;
    //
    // const { members } = conversation;
    //
    // const listSocketId = [];
    // for (const member of members) {
    //   const temp = (await this.cacheManager.get<string[]>(member.id)) || [];
    //   listSocketId.push(...temp);
    // }
    //
    // let senderSocketIds = await this.cacheManager.get<string[]>(sender.id);
    //
    // senderSocketIds = senderSocketIds.filter((socketId) => socketId !== client.id);
    //
    //
    // listSocketId.push(...senderSocketIds);
    // if (sender && !isEmpty(listSocketId)) {
    //   client.to(listSocketId).emit('publish/messages.SEND', payload);
    // }
  }

  @SubscribeMessage('conversation.friendIsOnline')
  async friendIsOnline(@MessageBody() payload, @ConnectedSocket() client: Socket) {
    const { conversation, caller } = payload;

    const result = await this.conversationsService.getFriendInConversation(conversation, caller.id);
    if (result) {
      const members = result.members as Profile[];
      const listSocketId = (await this.cacheManager.get<string[]>(members[0].id)) || [];
      client.emit('result.friendIsOnline', !isEmpty(listSocketId));
    }
  }
}
