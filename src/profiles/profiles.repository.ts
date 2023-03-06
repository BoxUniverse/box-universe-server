import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FriendsProfile } from '@src/friends';
import { ProfileDocument, ProfileInput, Profile } from '@src/profiles';
import { isEmpty } from 'lodash';
import { Model } from 'mongoose';
@Injectable()
export class ProfilesRepository {
  constructor(@InjectModel(Profile.name) private readonly profileModel: Model<ProfileDocument>) {}

  createProfile(createInput: ProfileInput.Create): Promise<Profile> {
    const profile = new this.profileModel(createInput);
    return profile.save();
  }
  async searchUser(searchInput: ProfileInput.Search): Promise<Profile[]> {
    return this.profileModel.find({
      name: { $regex: `.*${searchInput.keyword}.*`, $options: 'i' },
    });
  }

  async getProfile(profileInput: Partial<Profile>): Promise<Profile> {
    const { id } = profileInput;
    const profile = await this.profileModel.aggregate<Profile>([
      {
        $match: {
          id,
        },
      },
      {
        $unwind: {
          path: '$friends',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'friends.friendId',
          foreignField: 'id',
          as: 'friends',
        },
      },
      {
        $unwind: {
          path: '$friends',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          id: {
            $first: '$id',
          },
          name: {
            $first: '$name',
          },
          email: {
            $first: '$email',
          },
          avatar: {
            $first: '$avatar',
          },
          provider: {
            $first: '$provider',
          },
          updatedAt: {
            $first: '$updatedAt',
          },
          friends: {
            $push: '$friends',
          },
          countFriend: {
            $sum: 1,
          },
        },
      },
    ]);
    if (!isEmpty(profile)) return profile[0];
    return null;
  }

  async getEntireFriends(id: string): Promise<FriendsProfile> {
    return this.profileModel.findOne(
      { id },
      {
        friends: 1,
        _id: 0,
      },
    );
  }
  async updateAvatar(url: string, id: string) {
    return this.profileModel.findOneAndUpdate({ id }, { avatar: url }, { returnDocument: 'after' });
  }
  async addFriend(userId: string, friendId: string) {
    const model = this.profileModel;
    const requestor = (async () => {
      return model.updateOne(
        { id: userId },
        {
          $push: { friends: { friendId } },
        },
      );
    })();
    const receiver = (() => {
      return model.updateOne(
        { id: friendId },
        {
          $push: { friends: { friendId: userId } },
        },
      );
    })();
    const [_receiver, _requestor] = await Promise.all([receiver, requestor]);
    return _receiver.modifiedCount && _requestor.modifiedCount;
  }
  async unFriend(userId: string, friendId: string) {
    const model = this.profileModel;
    const requestor = (async () => {
      return model.updateOne(
        { id: userId },
        {
          $pull: { friends: { friendId } },
        },
      );
    })();
    const receiver = (() => {
      return model.updateOne(
        { id: friendId },
        {
          $pull: { friends: { friendId: userId } },
        },
      );
    })();
    const [_receiver, _requestor] = await Promise.all([receiver, requestor]);
    return _receiver.modifiedCount && _requestor.modifiedCount;
  }
}
