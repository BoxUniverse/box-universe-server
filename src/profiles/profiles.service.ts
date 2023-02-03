import { Injectable } from '@nestjs/common';
import { ProfilesRepository } from './profiles.repository';
import { Profile } from '@profiles/profiles.schema';
import ProfileInput from './dto/profile.input';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly profilesRepository: ProfilesRepository,

    @InjectQueue('profile-queue') private readonly profileQueue: Queue,
  ) {}

  async searchUser(searchInput: ProfileInput.Search): Promise<Profile[]> {
    return this.profilesRepository.searchUser(searchInput);
  }
  async getProfile(profileInput: Partial<Profile>): Promise<Profile> {
    return this.profilesRepository.getProfile(profileInput);
  }
  async updateAvatar(url: string, id: string) {
    return this.profilesRepository.updateAvatar(url, id);
  }
  async addFriend(userId: string, friendId: string) {
    return this.profilesRepository.addFriend(userId, friendId);
  }
  async unFriend(userId: string, friendId: string) {
    return this.profilesRepository.unFriend(userId, friendId);
  }

  async queueAddFriend(userId: string, friendId: string) {
    return this.profileQueue.add(
      'addFriend',
      { userId, friendId },
      { removeOnComplete: false, removeOnFail: false },
    );
  }
}
