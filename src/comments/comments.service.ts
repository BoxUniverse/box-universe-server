import { Injectable } from '@nestjs/common';
import { Comment, CommentInput, CommentsRepository } from '@src/comments';

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

  async getComments(payload: CommentInput.PaginationComment) {
    return this.commentsRepository.getComments(payload);
  }

  async getProfilesCommented(post: string) {
    return this.commentsRepository.getProfilesCommented(post);
  }
}
