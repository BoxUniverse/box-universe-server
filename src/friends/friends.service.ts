import { Injectable } from '@nestjs/common';
import { ProfilesRepository } from '@profiles/profiles.repository';
import { FriendsProfile } from './types';

@Injectable()
export class FriendsService {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  async getEntireFriends(id: string): Promise<FriendsProfile> {
    return this.profilesRepository.getEntireFriends(id);
  }
}
