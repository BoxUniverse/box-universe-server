import { forwardRef, Inject, Injectable } from '@nestjs/common';

import { ProfilesRepository } from '@src/profiles';
import { OAuthInput, User, UserInput, UserOAuth, UsersRepository } from '@src/users';
import { DeleteResult } from 'mongodb';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    @Inject(forwardRef(() => ProfilesRepository))
    private readonly profilesRepository: ProfilesRepository,
  ) {}

  getUser(getUserInput: UserInput.GetUser): Promise<User> {
    return this.usersRepository.getUser(getUserInput);
  }

  getListUsers(): Promise<User[]> {
    return this.usersRepository.getListUsers();
  }

  async createUser(createUserInput: UserInput.CreateUser): Promise<User> {
    const user = await this.usersRepository.createUser(createUserInput);

    void this.profilesRepository.createProfile({
      provider: 'credentials',
      name: user.email,
      id: user._id.toString(),
      email: user.email,
    });
    return user;
  }

  deleteUser(deleteUserInput: UserInput.DeleteUser): Promise<User> {
    return this.usersRepository.deleteUser(deleteUserInput);
  }

  softDeleteUser(deleteUserInput: UserInput.DeleteUser) {
    return this.usersRepository.softDeleteUser(deleteUserInput);
  }

  deleteEntireUser(): Promise<DeleteResult> {
    return this.usersRepository.deleteEntireUser();
  }

  async OAuth(_OAuthInput: OAuthInput): Promise<User | UserOAuth> {
    const user = await this.usersRepository.OAuth(_OAuthInput);
    if ('provider' in user) {
      const { id, email, provider } = user;
      const { name } = _OAuthInput;
      void this.profilesRepository.createProfile({
        id,
        name,
        email,
        provider,
      });
    }

    return user;
  }
}
