import { Authorization } from '@common/decorators';
import { AuthGuard } from '@common/guards';
import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Current } from '@src/users';
import { Conversation, ConversationInput, ConversationsService } from '@src/conversations';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver()
@UseGuards(AuthGuard)
export class ConversationsResolver {
  constructor(
    private readonly conversationsService: ConversationsService,
    @Inject('PUBSUB') private readonly pubSub: RedisPubSub,
  ) {}

  @Mutation(() => Boolean, {
    name: 'createConversation',
    nullable: true,
  })
  async createConversation(
    @Args({ name: 'infoConversation', type: () => ConversationInput.CreateConversation })
    infoConversation: ConversationInput.CreateConversation,
  ): Promise<Conversation> {
    return this.conversationsService.createConversation(infoConversation);
  }

  @Query(() => [Conversation], {
    name: 'getConversationByProfileId',
    nullable: true,
  })
  async getConversationByProfileId(
    @Args({ name: 'profileId', type: () => String }) profileId: string,
  ) {
    return this.conversationsService.getConversationByProfileId(profileId);
  }

  @Query(() => Conversation, {
    name: 'getConversationById',
    nullable: true,
  })
  async getConversationById(
    @Args({ name: 'conversationId', type: () => String }) conversationId: string,

    @Authorization()
    user: Current,
  ) {
    return this.conversationsService.getConversationById(conversationId, user._id.toString());
  }

  @Query(() => ConversationInput.ListFriendNotInConversation, {
    name: 'getListFriendNotInConversation',
    nullable: true,
  })
  async getListFriendNotInConversation(
    @Args({ name: 'conversationId', type: () => String }) conversationId: string,

    @Authorization()
    user: Current,
  ) {
    return this.conversationsService.getListFriendNotInConversation(
      conversationId,
      user._id.toString(),
    );
  }

  @Mutation(() => Conversation, {
    name: 'addMemberConversation',
    nullable: true,
  })
  async addMember(
    @Args({ name: 'conversationId', type: () => String }) conversationId: string,
    @Args({ name: 'profileIds', type: () => [String] }) profileId: string[],
  ) {
    const result = await this.conversationsService.addMember(conversationId, profileId);

    this.pubSub.publish('memberAdded', { memberAdded: result });

    return result;
  }

  @Query(() => Conversation, {
    name: 'getConversationByFriend',
    nullable: true,
  })
  async getConversationByFriend(
    @Args({ name: 'profileId', type: () => String }) profileId: string,
    @Args({ name: 'friendId', type: () => String }) friendId: string,
  ) {
    return this.conversationsService.getConversationByFriend(profileId, friendId);
  }

  @Mutation(() => Conversation, {
    name: 'changeNameConversation',
    nullable: true,
  })
  async changeNameConversation(
    @Args({ name: 'payload', type: () => ConversationInput.ChangeNameConversation })
    payload: ConversationInput.ChangeNameConversation,
  ) {
    return this.conversationsService.changeNameConversation(payload).then((result) => result);
  }

  @Subscription(() => Conversation, {
    name: 'memberAdded',
    nullable: true,
  })
  async memberAdded() {
    return this.pubSub.asyncIterator('memberAdded');
  }
}
