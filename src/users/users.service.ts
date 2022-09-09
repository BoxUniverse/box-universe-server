import { User } from '@users/users.schema';
import { UserInput } from './dto/user.input';
import { UsersRepository } from './users.repository';
import { Injectable } from '@nestjs/common';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';
import { CreateInput } from '@users/dto/create.input';
import { OAuthInput } from '@users/dto/oauth.input';
import { ProfilesRepository } from '@src/profiles/profiles.repository';
import { UserOAuth } from './types/UserOAuth';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly profilesRepository: ProfilesRepository,
  ) {}

  getUser(userInput: UserInput): Promise<User> {
    return this.usersRepository.getUser(userInput);
  }

  getListUsers(): Promise<User[]> {
    return this.usersRepository.getListUsers();
  }

  createUser(createInput: CreateInput): Promise<User> {
    return this.usersRepository.createUser(createInput);
  }

  deleteUser(userInput: UserInput): Promise<User> {
    return this.usersRepository.deleteUser(userInput);
  }

  softDeleteUser(userInput: UserInput): Promise<UpdateResult> {
    return this.usersRepository.softDeleteUser(userInput);
  }

  deleteEntireUser(): Promise<DeleteResult> {
    return this.usersRepository.deleteEntireUser();
  }

  updateRefreshToken(userId: string | ObjectId, refreshToken: string): Promise<UpdateResult> {
    return this.usersRepository.updateRefreshToken(userId, refreshToken);
  }

  async OAuth(_OAuthInput: OAuthInput): Promise<User | UserOAuth> {
    const user = await this.usersRepository.OAuth(_OAuthInput);
    if ('provider' in user) {
      console.log(user);

      const { id, username, email, provider } = user;
      this.profilesRepository.createProfile({
        id,
        email,
        provider,
      });
    }
    // console.log(user, '57');

    return user;
  }
}
