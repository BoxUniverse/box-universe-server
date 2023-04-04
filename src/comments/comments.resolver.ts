import { Authorization } from '@common/decorators';
import { AuthGuard } from '@common/guards';
import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  createUnionType,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Profile, ProfilesService } from '@src/profiles';
import { Comment, CommentsService, UnionPost } from '@src/comments';
import { PUB_SUB } from '@src/pubsub.module';
import { Current } from '@src/users';
import { PubSub } from 'graphql-subscriptions';
import { CommentInput } from '@src/comments';

@Resolver(() => Comment)
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
    const [comment, profile] = await Promise.all([
      this.commentsService.commentPost(user._id.toString(), post, text),
      this.profilesService.getProfile({
        id: user._id.toString(),
      }),
    ]);
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

  @Subscription(() => Comment, {
    name: 'commentAdded',
    nullable: true,
  })
  async commentAdded(@Args({ name: 'post', type: () => String }) post: string) {
    return this.pubSub.asyncIterator('commentAdded');
  }

  @Query(() => CommentInput.ProfilesCommentedPost, {
    nullable: false,
  })
  async getProfilesCommented(@Args({ name: 'post', type: () => String }) post: string) {
    return this.commentsService.getProfilesCommented(post);
  }
}
