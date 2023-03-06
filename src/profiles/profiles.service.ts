import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConversationsRepository } from '@src/conversations';
import { Queue } from 'bull';
import { Profile, ProfileInput, ProfilesRepository } from '@src/profiles';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly conversationsRepository: ConversationsRepository,
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
    const result = this.profileQueue.add(
      'addFriend',
      { userId, friendId },
      { removeOnComplete: true, removeOnFail: false },
    );
    this.conversationsRepository.createConversation({ members: [userId, friendId] });
    return result;
  }
}
