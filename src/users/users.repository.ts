import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OAuthInput, User, UserDocument, UserInput, UserOAuth } from '@src/users';
import { DeleteResult, ObjectId } from 'mongodb';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUser(userInput: UserInput.GetUser): Promise<User> {
    return this.userModel.findOne(userInput);
  }

  async getListUsers(): Promise<User[]> {
    return this.userModel.find({});
  }

  async createUser(createUserInput: UserInput.CreateUser): Promise<User> {
    const { username, password, email, provider } = createUserInput;
    return this.userModel.create({
      username,
      password,
      email,
      providers: [
        {
          type: provider.type,
        },
      ],
    });
  }

  async deleteUser(deleteUserInput: UserInput.DeleteUser): Promise<User> {
    return this.userModel.remove(deleteUserInput);
  }

  async softDeleteUser(deleteUserInput: UserInput.DeleteUser): Promise<User> {
    return this.userModel.findOneAndUpdate(deleteUserInput, {
      deletedAt: Date.now(),
    });
  }

  async deleteEntireUser(): Promise<DeleteResult> {
    return this.userModel.deleteMany({});
  }

  async updateRefreshToken(userId: string | ObjectId, refreshToken: string): Promise<User> {
    return this.userModel.findOneAndUpdate({ _id: userId }, { refreshToken });
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
    }
  }
}
