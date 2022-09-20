import { Injectable } from '@nestjs/common';
import { ProfilesRepository } from './profiles.repository';
import { Profile } from '@profiles/profiles.schema';
import ProfileInput from './dto/profile.input';
import { UsersRepository } from '@users/users.repository';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly profilesRepository: ProfilesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async searchUser(searchInput: ProfileInput.Search): Promise<Profile[]> {
    return this.profilesRepository.searchUser(searchInput);
  }
}
