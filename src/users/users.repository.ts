import { UserInput } from './dto/user.input';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';
import { CreateInput } from '@users/dto/create.input';
import { OAuthInput } from '@users/dto/oauth.input';

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

  async OAuth(OAuthInput: OAuthInput): Promise<User> {
    const { username, email, id, provider } = OAuthInput;
    return await this.userModel.findOneAndUpdate(
      { 'provider.id': id, 'provider.name': provider, email, username },
      {
        $set: {
          username,
          email,
          'provider.id': id,
          'provider.name': provider,
        },
      },
      { upsert: true, setDefaultsOnInsert: false, returnDocument: 'after' },
    );
  }
}
