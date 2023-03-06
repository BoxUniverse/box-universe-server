import { Injectable } from '@nestjs/common';
import { MessagesRepository, MessageInput } from '@src/messages';

@Injectable()
export class MessagesService {
  constructor(private readonly messagesRepository: MessagesRepository) {}

  async sendMessage(payload: MessageInput.Send, senderId: string) {
    return this.messagesRepository.sendMessage(
      payload.message,
      payload.conversationId,
      payload.now,
      senderId,
    );
  }

  async getMessagesByConversationId(conversationId: string, startValue: string) {
    return this.messagesRepository.getMessagesByConversationId(conversationId, startValue);
  }

  async sendFiles(files: string[], senderId: string, conversationId: string, now: any) {
    return this.messagesRepository.sendFiles(files, senderId, conversationId, now);
  }
}
