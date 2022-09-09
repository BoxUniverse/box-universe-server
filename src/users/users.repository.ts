import { UserInput } from './dto/user.input';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';
import { CreateInput } from '@users/dto/create.input';
import { OAuthInput } from '@users/dto/oauth.input';
import * as moment from 'moment';
import { isEqual, random, uniqWith } from 'lodash';
import { Provider } from './users.type';
import { UserOAuth } from './types/UserOAuth';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUser(userInput: UserInput): Promise<User> {
    return this.userModel.findOne(userInput);
  }

  async getListUsers(): Promise<User[]> {
    return this.userModel.find({});
  }

  async createUser(createInput: CreateInput): Promise<User> {
    const createdUser = new this.userModel(createInput);
    return createdUser.save();
  }

  async deleteUser(userInput: UserInput): Promise<User> {
    return this.userModel.remove(userInput);
  }

  async softDeleteUser(userInput: UserInput): Promise<UpdateResult> {
    return this.userModel.updateOne(userInput, {
      deletedAt: Date.now(),
    });
  }

  async deleteEntireUser(): Promise<DeleteResult> {
    return this.userModel.deleteMany({});
  }

  async updateRefreshToken(userId: string | ObjectId, refreshToken: string): Promise<UpdateResult> {
    return this.userModel.updateOne({ _id: userId }, { refreshToken });
  }

  async OAuth(OAuthInput: OAuthInput): Promise<User | UserOAuth> {
    const { email, id, provider } = OAuthInput;

    const existProvider = await this.userModel.findOne({
      email,
      'providers.type': provider,
      'providers.id': id,
    });
    if (existProvider) return existProvider as User;

    const existEmail = await this.userModel.findOne({
      email,
    });

    if (existEmail) {
      existEmail.providers.push({ type: provider, id });

      const result = await this.userModel
        .findOneAndUpdate(
          { email },
          { $addToSet: { providers: { type: provider, id } } },
          { returnDocument: 'after', returnOriginal: false },
        )
        .lean();

      return { ...result, id, provider } as UserOAuth;
    } else {
      const user = new this.userModel({
        email,
        providers: [
          {
            type: provider,
            id: id,
          },
        ],
      });
      const result = (await user.save({ validateBeforeSave: false })).toObject() as User;
      return { ...result, id, provider };
      // console.log(x);
    }
  }
}
