import { Injectable } from '@nestjs/common';
import { PostsService } from '@src/posts';
import { ProfilesService } from '@src/profiles';
import { LikesRepository } from '@src/likes';

@Injectable()
export class LikesService {
  /**
   *
   */
  constructor(
    private readonly likesRepository: LikesRepository,
    private readonly profilesService: ProfilesService,
    private readonly postsService: PostsService,
  ) {}

  async likePost(userId: string, postId: string) {
    const [user, post] = await Promise.all([
      this.profilesService.getProfile({
        id: userId,
      }),
      this.postsService.getPost({ _id: postId }),
    ]);
    if (user && post) return this.likesRepository.likePost(user, post);
    return null;
  }

  async unlikePost(userId: string, postId: string) {
    return this.likesRepository.unlikePost(userId, postId);
  }
}
