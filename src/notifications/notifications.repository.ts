import {
  Notification,
  NotificationDocument,
  NotificationGroup,
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

  async findAllNotifications(profile: string): Promise<NotificationGroup[]> {
    const x = await this.notificationModel.aggregate<NotificationGroup>([
      {
        $match: {
          'message.userReceive': {
            $in: [profile],
          },
        },
      },
      {
        $lookup: {
          from: 'posts',

          let: {
            idPost: {
              $toObjectId: '$message.post',
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$idPost'],
                },
              },
            },

            {
              $lookup: {
                from: 'profiles',
                as: 'profile',
                let: {
                  profile: '$profile',
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: ['$id', '$$profile'],
                      },
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: '$profile',
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
          as: 'message.post',
        },
      },
      {
        $unwind: {
          path: '$message.post',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $group: {
          _id: '$message.post._id',
          action: {
            $first: '$action',
          },
          post: {
            $first: '$message.post',
          },
          userReceive: {
            $first: '$message.userReceive',
          },
          groupUserAction: {
            $push: '$message.userAction',
          },
          type: {
            $first: '$type',
          },
          isRead: {
            $first: '$isRead',
          },
          createdAt: {
            $first: '$createdAt',
          },
          deletedAt: {
            $first: '$deletedAt',
          },
          updatedAt: {
            $first: '$updatedAt',
          },
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
    ]);
    console.log(x);
    return x;
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
    const greater = moment().subtract('5', 'm');
    const now = moment();
    const { type, message, action } = payload;

    return this.notificationModel.findOneAndUpdate(
      {
        type,
        'message.userAction': message.userAction,
        'message.post': message.post,
        action,
        updatedAt: {
          $gt: greater,
        },
      },
      {
        isRead: false,
        updatedAt: now,
        'message.userReceive': message.userReceive,
      },
      { upsert: true },
    );
  }
}
