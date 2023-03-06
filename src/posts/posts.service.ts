import { Injectable } from '@nestjs/common';
import { Post, PostInput, PostsRepository } from '@src/posts';
import { Profile } from '@src/profiles';

@Injectable()
export class PostsService {
  /**
   *
   */
  constructor(private readonly postsRepository: PostsRepository) {}
  async createPost(post: PostInput.CreatePost) {
    return this.postsRepository.createPost(post);
  }

  async deletePost(post: PostInput.DeletePost) {
    return this.postsRepository.deletePost(post);
  }

  async getPosts(userId: string, payload: PostInput.GetPosts) {
    return this.postsRepository.getPosts(userId, payload);
  }

  async getPost(post: PostInput.GetPost): Promise<Post<Profile>> {
    return this.postsRepository.getPost(post);
  }
}
