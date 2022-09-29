import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ProfilesRepository } from '@profiles/profiles.repository';
import { S3Service } from '@s3/s3.service';

@Processor('profile-queue')
export class ProfilesProcessor {
  constructor(private readonly profilesRepository: ProfilesRepository) {}

  @Process('updateAvatar')
  async handleUpdateAvatar(job: Job) {
    const { url, id } = job.data;
    this.profilesRepository.updateAvatar(url, id);
  }
}
