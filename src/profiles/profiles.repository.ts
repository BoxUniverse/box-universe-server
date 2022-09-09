import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './profiles.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import ProfileInput from './dto/profile.input';

@Injectable()
export class ProfilesRepository {
  constructor(@InjectModel(Profile.name) private readonly profileModel: Model<ProfileDocument>) {}

  createProfile(createInput: ProfileInput.Create): Promise<Profile> {
    const profile = new this.profileModel(createInput);
    // console.log(profile);

    return profile.save();
  }
}
