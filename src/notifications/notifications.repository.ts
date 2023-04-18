import {
  Notification,
  NotificationDocument,
  NotificationInput,
  PayloadMessageNotification,
} from '@src/notifications';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as moment from 'moment';

export class NotificationsRepository {
  constructor(
    @InjectModel(Notification.name) private readonly notificationModel: Model<NotificationDocument>,
  ) {}

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

  async findNotificationByPayload(payload: PayloadMessageNotification): Promise<Notification> {
    return this.notificationModel.findOne(payload);
  }

  async notify(payload: NotificationInput.Notify): Promise<Notification> {
    const greater = moment().subtract('10', 'm');
    const now = moment();

    return this.notificationModel.findOneAndUpdate(
      {
        ...payload,
        updatedAt: {
          $gt: greater,
        },
      },
      {
        isRead: false,
      },
      { upsert: true },
    );
  }
}
