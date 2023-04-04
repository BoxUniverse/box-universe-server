import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { UpdateResult } from 'mongodb';
import { Conversation, ConversationInput, ConversationsRepository } from '@src/conversations';
import { Profile } from '@src/profiles';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly conversationsRepository: ConversationsRepository,
    @InjectQueue('conversation-queue') private readonly conversationQueue: Queue,
  ) {}

  async createConversation(infoConversation: Partial<Conversation>) {
    return this.conversationsRepository.createConversation(infoConversation);
  }

  async getConversationByFriend(profileId, friendId) {
    return this.conversationsRepository.getConversationByFriend(profileId, friendId);
  }

  async queueCreateConversation(infoConversation: Partial<Conversation>) {
    return this.conversationQueue.add(
      'createConversation',
      { ...infoConversation },
      { removeOnComplete: true, removeOnFail: false },
    );
  }

  async getConversationByProfileId(profileId: string): Promise<Conversation[]> {
    return this.conversationsRepository.getConversationByProfileId(profileId);
  }

  async getConversationById(conversationId: string, profileId: string): Promise<Conversation> {
    return this.conversationsRepository.getConversationById(conversationId, profileId);
  }

  async getConversationByIdNoRef(conversationId: string) {
    return this.conversationsRepository.getConversationByIdNoRef(conversationId);
  }
  async getListFriendNotInConversation(conversationId: string, profileId: string) {
    return this.conversationsRepository.getListFriendNotInConversation(conversationId, profileId);
  }
  async addMember(
    conversationId: string,
    profileId: string[],
  ): Promise<UpdateResult | Conversation> {
    return this.conversationsRepository.addMember(conversationId, profileId);
  }
  async getFriendInConversation(
    conversationId: string,
    profileId: string,
  ): Promise<Conversation<Profile>> {
    return this.conversationsRepository.getFriendInConversation(conversationId, profileId);
  }

  async changeNameConversation(payload: ConversationInput.ChangeNameConversation) {
    return this.conversationsRepository.changeNameConversation(payload);
  }
  async getProfiles(conversation: string) {
    return this.conversationsRepository.getConversationByIdNoRef(conversation);
  }
}
