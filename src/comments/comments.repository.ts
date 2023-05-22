import { InjectModel } from '@nestjs/mongoose';
import { Post } from '@src/posts';
import { Profile } from '@src/profiles';
import { Comment, CommentDocument, CommentInput } from '@src/comments';
import { Model } from 'mongoose';
import { first, isEmpty } from 'lodash';
import { ObjectId } from 'mongodb';

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

  async getComments(payload: CommentInput.PaginationComment) {
    const $match = payload?.startValue
      ? {
          post: payload.post,
          _id: { $gt: new ObjectId(payload.startValue) },
        }
      : {
          post: payload.post,
        };
    return this.commentModel.aggregate<Comment<Profile, Post<Profile>>>([
      {
        $match,
      },
      {
        $limit: 10,
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

  async getProfilesCommented(post: string): Promise<CommentInput.ProfilesCommentedPost> {
    const result = await this.commentModel.aggregate<CommentInput.ProfilesCommentedPost>([
      {
        $match: {
          post,
        },
      },
      {
        $group: {
          _id: '$post',
          profiles: {
            $addToSet: '$profile',
          },
        },
      },
    ]);
    if (!isEmpty(result)) return first(result);
    return null;
  }
}
