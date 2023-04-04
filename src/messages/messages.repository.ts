import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MessageDocument, MessagesConversation, Message } from '@src/messages';
import { isEmpty } from 'lodash';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

@Injectable()
export class MessagesRepository {
  /**
   *
   */
  constructor(@InjectModel(Message.name) private readonly messageModel: Model<MessageDocument>) {}

  async sendMessage(message: string, conversationId: string, now, senderId: string) {
    const newMessage = new this.messageModel({
      sender: senderId,
      conversation: conversationId,
      createdAt: now,
      type: 'text',
      message,
    });
    return newMessage.save();
  }

  async getMessagesByConversationId(conversationId: string, startValue = null) {
    const result = await this.messageModel.aggregate<MessagesConversation>([
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $match: {
          conversation: conversationId,
          _id: { $lt: new ObjectId(startValue) },
        },
      },
      {
        $limit: 10,
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'sender',
          foreignField: 'id',
          as: 'sender',
        },
      },
      {
        $unwind: {
          path: '$sender',
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
      {
        $group: {
          _id: '$conversation',
          messages: {
            $push: {
              _id: '$_id',
              message: '$message',
              sender: '$sender',
              createdAt: '$createdAt',
              files: '$files',
              type: '$type',
            },
          },
          countMessage: {
            $sum: 1,
          },
        },
      },
    ]);
    if (!isEmpty(result)) return result[0];
    return null;
  }

  async sendFiles(files: string[], senderId: string, conversationId: string, now: any) {
    const newMessage = new this.messageModel({
      type: 'image',
      sender: senderId,
      conversation: conversationId,
      createdAt: now,
      files,
    });
    return newMessage.save();
  }
}
