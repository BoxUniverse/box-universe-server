import { Injectable } from '@nestjs/common';
import { Comment, CommentsRepository } from '@src/comments';

@Injectable()
export class CommentsService {
  /**
   *
   */
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async commentPost(userId: string, postId: string, text: string): Promise<Comment<string>> {
    return this.commentsRepository.commentPost(userId, postId, text);
  }

  async deleteComment(_id: string) {
    return this.commentsRepository.deleteComment(_id);
  }

  async getComments(post: string) {
    return this.commentsRepository.getComments(post);
  }
}
