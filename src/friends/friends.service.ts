import { Injectable } from '@nestjs/common';
import { ProfilesRepository } from '@src/profiles';
import { FriendsProfile } from '@src/friends';

@Injectable()
export class FriendsService {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  async getEntireFriends(id: string): Promise<FriendsProfile> {
    return this.profilesRepository.getEntireFriends(id);
  }
}
