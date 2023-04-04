import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isEmpty } from 'lodash';
import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Conversation, ConversationDocument, ConversationInput } from '@src/conversations';
import { Profile } from '@src/profiles';

@Injectable()
export class ConversationsRepository {
  constructor(
    @InjectModel(Conversation.name) private readonly conversationModel: Model<ConversationDocument>,
  ) {}

  async createConversation(infoConversation: Partial<Conversation>) {
    const conversation = new this.conversationModel(infoConversation);
    return conversation.save();
  }
  async getConversationByFriend(profileId: string, friendId: string) {
    const result = await this.conversationModel.aggregate([
      {
        $match: {
          $or: [{ members: [profileId, friendId] }, { members: [friendId, profileId] }],
          $expr: { $eq: [{ $size: '$members' }, 2] },
        },
      },
    ]);
    if (!isEmpty(result)) return result[0];
    return null;
  }
  async getConversationByProfileId(id: string): Promise<Conversation[]> {
    return this.conversationModel.aggregate<Conversation>([
      {
        $match: {
          members: {
            $in: [id],
          },
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'members',
          foreignField: 'id',
          as: 'members',
        },
      },
      {
        $unwind: {
          path: '$members',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          'members.id': {
            $nin: [id],
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          members: {
            $push: '$members',
          },
          name: {
            $first: '$name',
          },
          createdAt: {
            $first: '$createdAt',
          },
          updatedAt: {
            $first: '$updatedAt',
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
  }
  async getConversationById(conversationId: string, profileId: string): Promise<Conversation> {
    const result = await this.conversationModel.aggregate<Conversation>([
      {
        $match: {
          _id: new ObjectId(conversationId),
        },
      },
      {
        $unwind: {
          path: '$members',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'members',
          foreignField: 'id',
          as: 'members',
        },
      },
      {
        $unwind: {
          path: '$members',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          'members.id': {
            $nin: [profileId],
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          members: {
            $push: '$members',
          },
          name: {
            $first: '$name',
          },
          createdAt: {
            $first: '$createdAt',
          },
          updatedAt: {
            $first: '$updatedAt',
          },
          countMember: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    if (!isEmpty(result)) return result[0];
    return null;
  }

  async getConversationByIdNoRef(conversationId: string): Promise<Conversation> {
    return this.conversationModel.findOne({ _id: conversationId });
  }

  async getListFriendNotInConversation(
    conversationId: string,
    profileId: string,
  ): Promise<ConversationInput.ListFriendNotInConversation> {
    const result =
      await this.conversationModel.aggregate<ConversationInput.ListFriendNotInConversation>([
        {
          $match: {
            _id: new ObjectId(conversationId),
          },
        },
        {
          $lookup: {
            from: 'profiles',
            localField: 'members',
            foreignField: 'id',
            as: 'membersDetail',
          },
        },
        {
          $unwind: {
            path: '$membersDetail',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            'membersDetail.id': profileId,
          },
        },
        {
          $project: {
            result: {
              $filter: {
                input: '$membersDetail.friends',
                as: 'friend',
                cond: {
                  $not: {
                    $in: ['$$friend.friendId', '$members'],
                  },
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: 'profiles',
            localField: 'result.friendId',
            foreignField: 'id',
            as: 'result',
          },
        },
      ]);
    if (!isEmpty(result)) return result[0];
    return null;
  }

  async addMember(conversationId: string, profileId: string[]): Promise<Conversation> {
    const conversation = await this.conversationModel.findOne({
      _id: conversationId,
    });
    if (conversation.members.length > 2) {
      return this.conversationModel.findOneAndUpdate(
        {
          _id: conversationId,
        },
        { $push: { members: { $each: profileId } } },
      );
    } else {
      const oldMember = conversation.members;
      const result = new this.conversationModel({
        members: [...oldMember, ...profileId],
      });
      return result.save();
    }
  }

  async getFriendInConversation(
    conversationId: string,
    profileId: string,
  ): Promise<Conversation<Profile>> {
    const result = await this.conversationModel.aggregate<Conversation<Profile>>([
      {
        $match: {
          _id: new ObjectId(conversationId),
        },
      },
      {
        $project: {
          members: {
            $filter: {
              input: '$members',
              as: 'members',
              cond: {
                $ne: ['$$members', profileId],
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'members',
          foreignField: 'id',
          as: 'members',
        },
      },
    ]);
    if (!isEmpty(result)) return result[0];
    return null;
  }
  async changeNameConversation(
    payload: ConversationInput.ChangeNameConversation,
  ): Promise<Conversation> {
    return this.conversationModel.findOneAndUpdate(
      {
        _id: payload._id,
      },
      {
        name: payload.name,
      },
    );
  }
}
