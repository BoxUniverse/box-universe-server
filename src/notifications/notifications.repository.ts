import { Notification, NotificationDocument, NotificationInput } from '@src/notifications';
import { Model } from 'mongoose';
export class NotificationsRepository {
  constructor(private readonly notificationModel: Model<NotificationDocument>) {}

  async findAllNotifications(profile: string): Promise<Notification[]> {
    return this.notificationModel.find({
      profile,
    });
  }

  async findNotification(id: string): Promise<Notification> {
    return this.notificationModel.findOne({
      id,
    });
  }

  async notify(payload: NotificationInput.Notify): Promise<Notification> {
    return new this.notificationModel(payload);
  }
}
