import { Module } from '@nestjs/common';
import {
  NotificationsGateway,
  NotificationsResolver,
  NotificationsService,
} from '@src/notifications';

@Module({
  providers: [NotificationsService, NotificationsResolver, NotificationsGateway],
})
export class NotificationsModule {}
