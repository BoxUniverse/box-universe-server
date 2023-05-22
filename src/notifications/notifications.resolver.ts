import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  NotificationsService,
  Notification,
  NotificationInput,
  NotificationGroup,
} from '@src/notifications';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@common/guards';

@Resolver(() => Notification)
@UseGuards(AuthGuard)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}
  @Query(() => [NotificationGroup], {
    name: 'getNotifications',
    nullable: true,
  })
  async getAllNotifications(
    @Args({ name: 'profile', type: () => String }) profile: string,
  ): Promise<NotificationGroup[]> {
    return this.notificationsService.getAllNotifications(profile);
  }

  @Query(() => Notification, {
    name: 'getNotification',
    nullable: true,
  })
  async getNotification(
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<Notification> {
    return this.notificationsService.getNotification(id);
  }
}
