import { Injectable } from '@nestjs/common';
import { ProfilesRepository } from './profiles.repository';
import { Profile } from '@profiles/profiles.schema';
import ProfileInput from './dto/profile.input';

@Injectable()
export class ProfilesService {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  async searchUser(searchInput: ProfileInput.Search): Promise<Profile[]> {
    return this.profilesRepository.searchUser(searchInput);
  }
  async getProfile(profileInput: Partial<Profile>): Promise<Profile> {
    return this.profilesRepository.getProfile(profileInput);
  }
  async updateAvatar(url: string, id: string) {
    return this.profilesRepository.updateAvatar(url, id);
  }
}
