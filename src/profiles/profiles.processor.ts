import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ProfilesRepository } from '@src/profiles';

@Processor('profile-queue')
export class ProfilesProcessor {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  @Process('updateAvatar')
  async handleUpdateAvatar(job: Job) {
    const { url, id } = job.data;
    return this.profilesRepository.updateAvatar(url, id);
  }

  @Process('addFriend')
  async handleAddFriend(job: Job) {
    const { userId, friendId } = job.data;
    return this.profilesRepository.addFriend(userId, friendId);
  }
}
