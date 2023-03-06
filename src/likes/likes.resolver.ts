import { Authorization } from '@common/decorators';
import { AuthGuard } from '@common/guards';
import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Subscription } from '@nestjs/graphql';
import { Post, PostsService } from '@src/posts';
import { Profile } from '@src/profiles';
import { PUB_SUB } from '@src/pubsub.module';

import { Like, LikesService } from '@src/likes';
import { Current } from '@src/users';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver()
@UseGuards(AuthGuard)
export class LikesResolver {
  /**
   *
   */
  constructor(
    private readonly likesService: LikesService,
    private readonly postsService: PostsService,

    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  @Mutation(() => Like, {
    name: 'likePost',
    nullable: true,
  })
  async likePost(
    @Authorization() user: Current,
    @Args({ name: 'post', type: () => String })
    post: string,
  ): Promise<Like<Profile, Post<Profile>>> {
    const likeResult = await this.likesService.likePost(user._id.toString(), post);
    const postResult = await this.postsService.getPost({ _id: post });

    this.pubSub.publish(`newLike_${post}`, {
      [`newLike`]: postResult,
    });
    return likeResult;
  }

  @Mutation(() => Number, {
    name: 'unlikePost',
    nullable: false,
  })
  async unlikePost(
    @Authorization() user: Current,
    @Args({ name: 'post', type: () => String }) post: string,
  ) {
    const resultLike = await this.likesService.unlikePost(user._id.toString(), post);
    const postResult = await this.postsService.getPost({ _id: post });

    void this.pubSub.publish(`newLike_${post}`, {
      [`newLike`]: postResult,
    });
    // console.log(postResult);

    return resultLike.deletedCount;
  }

  @Subscription(() => Post, {
    name: 'newLike',
    nullable: false,
  })
  async newLike(
    @Authorization() user: Current,
    @Args({ name: 'post', type: () => String }) post: string,
  ) {
    return this.pubSub.asyncIterator<Post<Profile>>(`newLike_${post}`);
  }
}
