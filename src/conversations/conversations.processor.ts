import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ConversationsRepository } from '@src/conversations';

@Processor('conversation-queue')
export class ConversationsProcessor {
  constructor(private readonly conversationsRepository: ConversationsRepository) {}

  @Process('createConversation')
  async handleUpdateAvatar(job: Job) {
    return this.conversationsRepository.createConversation(job.data);
  }
}
