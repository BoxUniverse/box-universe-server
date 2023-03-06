import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ConversationsService } from '@src/conversations';
import { Profile } from '@src/profiles';
import { Cache } from 'cache-manager';
import { isEmpty } from 'lodash';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3005, { cors: true, maxHttpBufferSize: 1e8 })
@Injectable()
export class MessagesGateway {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly conversationsService: ConversationsService,
  ) {}
  @WebSocketServer() server: Server;

  @SubscribeMessage('messages.SEND')
  async handleSendMessage(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const { sender, conversation, message } = payload;
    if (!conversation.members) return;

    const { members } = conversation;

    const listSocketId = [];
    for (const member of members) {
      const temp = (await this.cacheManager.get<string[]>(member.id)) || [];
      listSocketId.push(...temp);
    }

    let senderSocketIds = await this.cacheManager.get<string[]>(sender.id);

    senderSocketIds = senderSocketIds.filter((socketId) => socketId !== client.id);

    listSocketId.push(...senderSocketIds);
    if (sender && !isEmpty(listSocketId)) {
      client.to(listSocketId).emit('publish/messages.SEND', payload);
    }
  }
  @SubscribeMessage('messages.SEND_FILES')
  async handleSendFiles(
    @MessageBody() payload: any,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    
    const validExtFilePattern =
      /^(((image)\/(png|jpg|jpeg|webp))|((text)\/(plain))|((application)\/(pdf)))$/g;

    const { sender, conversation, message } = payload;
    if (!conversation.members) return;

    const { members } = conversation;

    const listSocketId = [];
    for (const member of members) {
      const temp = (await this.cacheManager.get<string[]>(member.id)) || [];
      listSocketId.push(...temp);
    }

    let senderSocketIds = await this.cacheManager.get<string[]>(sender.id);

    senderSocketIds = senderSocketIds.filter((socketId) => socketId !== client.id);
    listSocketId.push(...senderSocketIds);
    if (sender && !isEmpty(listSocketId)) {
      const files = payload.files.map((info) => {
        const type: string = info.type;
        if (!isEmpty(type.match(validExtFilePattern))) {
          const buffer = Buffer.from(info.file, 'base64');

          const base64 = buffer.toString('base64');
          return {
            file: info.file,
            type: info.type,
          };
        }
      });

      // 
      const newPayload = {
        ...payload,
        files: [...files],
      };

      client.to(listSocketId).emit('publish/messages.SEND_FILES', newPayload);
    }
  }
  @SubscribeMessage('messages.CALL')
  async handleStartCall(@MessageBody() payload, @ConnectedSocket() client) {
    const { caller, conversation, signalData } = payload;
    const result = await this.conversationsService.getFriendInConversation(conversation, caller.id);
    if (result) {
      const members = result.members as Profile[];
      const listSocketId = [];

      // for (const member of members) {
      const temp = (await this.cacheManager.get<string[]>(members[0].id)) || [];
      listSocketId.push(...temp);
      // }
      if (!isEmpty(listSocketId)) {
        // client.emit('call.success', 'success');
        client.to(listSocketId).emit('messages.INCOMING_CALL', {
          caller,
          conversation,
          signalData,
        });
      } else {
        // const socketCaller = await this.cacheManager.get<string[]>(caller.id);

        client.emit('messages.USER_OFFLINE', 'USER_OFFLINE');
      }
    }
  }

  @SubscribeMessage('messages.ACCEPT_CALL')
  async handleAcceptCall(@MessageBody() payload, @ConnectedSocket() client) {
    const { caller, receiver, signalData } = payload;

    const listSocketId = (await this.cacheManager.get<string[]>(caller.id)) || [];

    client.to(listSocketId).emit('receiver.ACCEPT_CALL', {
      caller,
      receiver,
      signalData,
    });
  }

  @SubscribeMessage('messages.REJECT_CALL')
  async handleRejectCall(@MessageBody() payload, @ConnectedSocket() client) {
    const { caller, receiver } = payload;

    const listSocketId = (await this.cacheManager.get<string[]>(caller.id)) || [];

    client.to(listSocketId).emit('receiver.REJECT_CALL', {
      caller,
      receiver,
    });
  }

  @SubscribeMessage('messages.SELF_REJECT')
  async handleSelfReject(@MessageBody() payload, @ConnectedSocket() client) {
    const { caller, conversation } = payload;
    const result = await this.conversationsService.getFriendInConversation(conversation, caller.id);
    const members = result.members as Profile[];
    const listSocketId = [];

    for (const member of members) {
      const temp = (await this.cacheManager.get<string[]>(member.id)) || [];
      listSocketId.push(...temp);
    }
    client.to(listSocketId).emit('messages.SELF_REJECT', {
      caller,
      conversation,
    });
  }

  @SubscribeMessage('messages.STOP_CALL')
  async handleStopCall(@MessageBody() payload, @ConnectedSocket() client) {
    const { userAction, caller, receiver } = payload;
    

    
    let listSocketId = [];

    if (userAction.id === receiver.id) {
      listSocketId = await this.cacheManager.get<string[]>(caller.id);
    } else {
      listSocketId = await this.cacheManager.get<string[]>(receiver.id);
    }

    client.to(listSocketId).emit('messages.STOP_CALL', {
      caller,
      receiver,
      userAction,
    });
  }
}
