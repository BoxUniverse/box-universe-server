import { Module } from '@nestjs/common';
import {
  Notification,
  NotificationSchema,
  NotificationsGateway,
  NotificationsRepository,
  NotificationsResolver,
  NotificationsService,
} from '@src/notifications';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsModule } from '@src/comments';
import { ConversationsModule } from '@src/conversations';

@Module({
  imports: [
    CommentsModule,
    ConversationsModule,
    MongooseModule.forFeatureAsync([
      {
        name: Notification.name,
        useFactory: () => {
          return NotificationSchema;
        },
      },
    ]),
  ],
  providers: [
    NotificationsService,
    NotificationsResolver,
    NotificationsGateway,
    NotificationsRepository,
  ],
})
export class NotificationsModule {}
