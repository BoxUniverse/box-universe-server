import { InjectModel } from '@nestjs/mongoose';
import { LikeDocument, Like } from '@src/likes';
import { Post } from '@src/posts';
import { Profile } from '@src/profiles';
import { DeleteResult } from 'mongodb';
import { Model } from 'mongoose';

export class LikesRepository {
  /**
   *
   */
  constructor(@InjectModel(Like.name) private readonly likeModel: Model<LikeDocument>) {}

  async likePost(user: Profile, post: Post<Profile>): Promise<Like<Profile, Post<Profile>>> {
    const document: Like = await new this.likeModel({
      profile: user.id,
      post: post._id.toString(),
    }).save();
    return {
      ...document,
      profile: user,
      post: post,
    };
  }

  async unlikePost(userId: string, postId: string): Promise<DeleteResult> {
    return this.likeModel.deleteOne({
      profile: userId,
      post: postId,
    });
  }
}
