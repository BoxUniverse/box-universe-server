import { BullModule } from '@nestjs/bull';
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConversationsModule } from '@src/conversations';
import { S3Module } from '@src/s3';
import {
  Message,
  MessageSchema,
  MessagesGateway,
  MessagesRepository,
  MessagesResolver,
  MessagesService,
} from '@src/messages';

@Module({
  providers: [MessagesService, MessagesResolver, MessagesRepository, MessagesGateway],
  imports: [
    BullModule.registerQueue({
      name: 'message-queue',
    }),
    forwardRef(() => ConversationsModule),
    MongooseModule.forFeatureAsync([
      {
        name: Message.name,
        useFactory: () => {
          return MessageSchema;
        },
      },
    ]),
    S3Module,
  ],
})
export class MessagesModule {}
