import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from '@profiles/profiles.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import ProfileInput from '@profiles/dto/profile.input';

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
    return this.profileModel.findOne({ id });
  }
  async updateAvatar(url: string, id: string) {
    return this.profileModel.findOneAndUpdate({ id }, { avatar: url }, { returnDocument: 'after' });
  }
}
