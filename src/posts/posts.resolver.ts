import { Authorization } from '@common/decorators';
import { AuthGuard } from '@common/guards';
import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Profile, ProfilesService } from '@src/profiles';
import { PublisherSubscriptions } from '@src/pubsub.input';
import { Post, PostInput, PostsService } from '@src/posts';
import { PUB_SUB } from '@src/pubsub.module';
import { Current } from '@src/users';
import { RedisPubSub } from 'graphql-redis-subscriptions';

@Resolver(() => Post)
@UseGuards(AuthGuard)
export class PostsResolver {
  constructor(
    private readonly postsService: PostsService,
    private readonly profilesService: ProfilesService,
    @Inject(PUB_SUB) private readonly pubSub: RedisPubSub,
  ) {}

  @Mutation(() => Post, {
    name: 'createPost',
    nullable: false,
  })
  async createPost(
    @Authorization()
    user: Current,
    @Args({ name: 'post', type: () => PostInput.CreatePost }) post: PostInput.CreatePost,
  ) {
    const _post = {
      ...post,
      profile: user._id.toString(),
    };

    const resultPost = this.postsService.createPost(_post);
    const profile = this.profilesService.getProfile({
      id: user._id.toString(),
    });

    const resultPromise = await Promise.all([resultPost, profile]);

    const [resultPromisePost, resultPromiseProfile] = resultPromise;
    if (resultPromisePost && resultPromiseProfile) {
      const { _id, content, createdAt, deletedAt, updatedAt } = resultPromisePost;
      const result = {
        _id,
        content,
        deletedAt,
        createdAt,
        updatedAt,
        profile: resultPromiseProfile,
      };

      await this.pubSub.publish(`postAdded.${resultPromiseProfile.id}`, {
        [`postAdded`]: result,
      });

      return result;
    }
  }

  @Mutation(() => Post, {
    name: 'deletePost',
    nullable: true,
  })
  async deletePost(
    @Args({ name: 'post', type: () => PostInput.DeletePost })
    post: PostInput.DeletePost,
  ) {
    void this.postsService.deletePost(post);
  }

  @Query(() => [Post], {
    name: 'getPosts',
    nullable: true,
  })
  async getPosts(
    @Args({ name: 'payload', nullable: true, defaultValue: null, type: () => PostInput.GetPosts })
    payload: PostInput.GetPosts,
    @Authorization()
    user: Current,
  ) {
    return this.postsService.getPosts(user._id.toString(), payload);
  }

  @Subscription(() => Post, {
    name: 'postAdded',
  })
  async postAdded(
    @Authorization()
    user: Current,
    @Args({ name: 'publisher', type: () => PublisherSubscriptions, nullable: true })
    publisher: PublisherSubscriptions,
  ) {
    const pub = publisher?.id || user._id;

    if (pub) {
      return this.pubSub.asyncIterator<Post<Profile>>(`postAdded.${pub}`);
    }
  }
}
