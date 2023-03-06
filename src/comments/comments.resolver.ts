import { Authorization } from '@common/decorators';
import { AuthGuard } from '@common/guards';
import { Inject, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Post } from '@src/posts';
import { Profile, ProfilesService } from '@src/profiles';
import { Comment, CommentsService } from '@src/comments';
import { PUB_SUB } from '@src/pubsub.module';
import { Current } from '@src/users';
import { PubSub } from 'graphql-subscriptions';

@Resolver()
@UseGuards(AuthGuard)
export class CommentsResolver {
  /**
   *
   */
  constructor(
    private readonly commentsService: CommentsService,
    private readonly profilesService: ProfilesService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => Comment, {
    name: 'commentPost',
    nullable: false,
  })
  async commentPost(
    @Authorization() user: Current,
    @Args({ name: 'post', type: () => String }) post: string,
    @Args({ name: 'text', type: () => String }) text: string,
  ): Promise<Comment<Profile>> {
    const promises = [
      this.commentsService.commentPost(user._id.toString(), post, text),
      this.profilesService.getProfile({
        id: user._id.toString(),
      }),
    ];
    const [comment, profile] = await Promise.all(promises);
    const result: Comment<Profile> = {
      ...comment,
      profile: {
        ...profile,
      } as Profile,
    } as Comment<Profile>;
    await this.pubSub.publish('commentAdded', {
      commentAdded: result,
    });
    return result;
  }

  @Mutation(() => Comment, {
    name: 'deleteComment',
    nullable: false,
  })
  async deleteComment(
    @Authorization() user: Current,
    @Args({ name: 'id', type: () => ID }) id: string,
  ) {
    return this.commentsService.deleteComment(id);
  }

  @Query(() => [Comment], {
    name: 'getComments',
    nullable: true,
  })
  async getComments(@Args({ name: 'post', type: () => String }) post: string) {
    return this.commentsService.getComments(post);
  }

  @Subscription(() => Post, {
    name: 'commentAdded',
    nullable: true,
  })
  async commentAdded(@Args({ name: 'post', type: () => String }) post: string) {
    return this.pubSub.asyncIterator('commentAdded');
  }
}
