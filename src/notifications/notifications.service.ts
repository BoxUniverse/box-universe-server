import { Injectable } from '@nestjs/common';
import {
  Notification,
  NotificationsRepository,
  NotificationInput,
  PayloadMessageNotification,
  NotificationGroup,
} from '@src/notifications';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationsRepository: NotificationsRepository) {}
  async getAllNotifications(profile: string): Promise<NotificationGroup[]> {
    return this.notificationsRepository.findAllNotifications(profile);
  }
  async getNotification(id: string): Promise<Notification> {
    return this.notificationsRepository.findNotification(id);
  }
  async notify(payload: NotificationInput.Notify): Promise<Notification> {
    return this.notificationsRepository.notify(payload);
  }

  async getNotificationByPayload(payload: PayloadMessageNotification): Promise<Notification> {
    return this.notificationsRepository.findNotificationByPayload(payload);
  }
}
