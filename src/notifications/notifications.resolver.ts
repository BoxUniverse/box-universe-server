import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NotificationsService, Notification, NotificationInput } from '@src/notifications';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private readonly notificationsService: NotificationsService) {}
  @Query(() => [Notification], {
    name: 'getAllNotifications',
    nullable: true,
  })
  async getAllNotifications(
    @Args({ name: 'profile', type: () => String }) profile: string,
  ): Promise<Notification[]> {
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
