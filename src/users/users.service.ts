import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { ProfilesRepository } from '@src/profiles';
import { CreateInput, OAuthInput, User, UserInput, UserOAuth, UsersRepository } from '@src/users';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(forwardRef(() => ProfilesRepository))
    private readonly profilesRepository: ProfilesRepository,
  ) {}

  getUser(userInput: UserInput): Promise<User> {
    return this.usersRepository.getUser(userInput);
  }

  getListUsers(): Promise<User[]> {
    return this.usersRepository.getListUsers();
  }

  async createUser(createInput: CreateInput): Promise<User> {
    const user = await this.usersRepository.createUser(createInput);

    this.profilesRepository.createProfile({
      provider: 'credentials',
      name: user.email,
      id: user._id.toString(),
      email: user.email,
    });
    return user;
  }

  deleteUser(userInput: UserInput): Promise<User> {
    return this.usersRepository.deleteUser(userInput);
  }

  softDeleteUser(userInput: UserInput) {
    return this.usersRepository.softDeleteUser(userInput);
  }

  deleteEntireUser(): Promise<DeleteResult> {
    return this.usersRepository.deleteEntireUser();
  }

  updateRefreshToken(userId: string | ObjectId, refreshToken: string) {
    return this.usersRepository.updateRefreshToken(userId, refreshToken);
  }

  async OAuth(_OAuthInput: OAuthInput): Promise<User | UserOAuth> {
    const user = await this.usersRepository.OAuth(_OAuthInput);
    if ('provider' in user) {
      const { id, email, provider } = user;
      const { name } = _OAuthInput;
      this.profilesRepository.createProfile({
        id,
        name,
        email,
        provider,
      });
    }

    return user;
  }
}
