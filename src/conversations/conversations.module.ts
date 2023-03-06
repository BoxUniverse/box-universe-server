import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessagesModule } from '@src/messages';
import { ProfilesModule } from '@src/profiles';
import {
  ConversationSchema,
  Conversation,
  ConversationsRepository,
  ConversationsService,
  ConversationsGateway,
  ConversationsResolver,
} from '@src/conversations';

@Module({
  imports: [
    forwardRef(() => ProfilesModule),
    forwardRef(() => MessagesModule),
    BullModule.registerQueue({
      name: 'conversation-queue',
    }),

    MongooseModule.forFeatureAsync([
      {
        name: Conversation.name,
        useFactory: () => {
          return ConversationSchema;
        },
      },
    ]),
  ],
  providers: [
    ConversationsService,
    ConversationsResolver,
    ConversationsRepository,
    ConversationsGateway,
  ],
  exports: [ConversationsRepository, ConversationsService],
})
export class ConversationsModule {}
