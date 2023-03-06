import { InjectModel } from '@nestjs/mongoose';
import { Post } from '@src/posts';
import { Profile } from '@src/profiles';
import { Comment, CommentDocument } from '@src/comments';
import { UpdateResult } from 'mongodb';
import { Model, Schema } from 'mongoose';

export class CommentsRepository {
  constructor(@InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>) {}
  async commentPost(userId: string, postId: string, text: string): Promise<Comment<string>> {
    const result = await new this.commentModel({
      profile: userId,
      post: postId,
      text,
    }).save();
    const { profile, post, text: _text, _id, deletedAt, createdAt, updatedAt } = result;
    return {
      profile,
      post,
      text: _text,
      _id,
      deletedAt,
      createdAt,
      updatedAt,
    };
  }

  async deleteComment(_id: string) {
    return this.commentModel.findOneAndUpdate(
      {
        _id,
      },
      {
        deletedAt: Date.now(),
      },
    );
  }

  async getComments(post: string) {
    return this.commentModel.aggregate<Comment<Profile, Post<Profile>>>([
      {
        $match: {
          post,
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'profile',
          foreignField: 'id',
          as: 'profile',
        },
      },
      {
        $unwind: {
          path: '$profile',
          preserveNullAndEmptyArrays: false,
        },
      },
    ]);
  }
}
