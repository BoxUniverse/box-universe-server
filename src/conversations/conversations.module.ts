import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsResolver } from './conversations.resolver';

@Module({
  providers: [ConversationsService, ConversationsResolver]
})
export class ConversationsModule {}
