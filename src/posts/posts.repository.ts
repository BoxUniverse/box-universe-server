import { InjectModel } from '@nestjs/mongoose';
import { PostDocument, PostInput, Post } from '@src/posts';
import { Profile } from '@src/profiles';
import { isEmpty } from 'lodash';
import { ObjectId } from 'mongodb';
import { Aggregate, Model, PipelineStage } from 'mongoose';

export class PostsRepository {
  constructor(@InjectModel(Post.name) private readonly postModel: Model<PostDocument>) {}

  async createPost(post: PostInput.CreatePost): Promise<Post<Profile>> {
    const result = new this.postModel(post);
    const _post = await result.save();
    return _post.toObject({ getters: true });
  }

  async deletePost(post: PostInput.DeletePost): Promise<Post> {
    return this.postModel.findOneAndUpdate({ _id: post._id }, { deletedAt: Date.now().toString() });
  }

  async getPosts(userId: string, payload: PostInput.GetPosts): Promise<Post<Profile>[]> {
    let $match = null;
    let pipelineStage: PipelineStage[] = [
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
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'likes',
          let: {
            id: '$_id',
          },
          pipeline: [
            {
              $addFields: {
                _post: {
                  $toObjectId: '$post',
                },
              },
            },
            {
              $addFields: {
                _deletedAt: {
                  $toString: '$deletedAt',
                },
              },
            },
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$_post', '$$id'],
                    },
                    {
                      $eq: ['$_deletedAt', null],
                    },
                  ],
                },
              },
            },
          ],
          as: 'likes',
        },
      },
      {
        $unset: ['likes._post', 'likes._deletedAt'],
      },
      {
        $lookup: {
          from: 'comments',
          let: {
            id: '$_id',
          },
          pipeline: [
            {
              $addFields: {
                _post: {
                  $toObjectId: '$post',
                },
              },
            },
            {
              $addFields: {
                _deletedAt: {
                  $toString: '$deletedAt',
                },
              },
            },
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$_post', '$$id'],
                    },
                    {
                      $eq: ['$_deletedAt', null],
                    },
                  ],
                },
              },
            },
          ],
          as: 'comments',
        },
      },
      {
        $unset: ['comments._post', 'comments._deletedAt'],
      },
      {
        $addFields: {
          countLike: {
            $size: '$likes',
          },
          countComment: {
            $size: '$comments',
          },
          isLiked: {
            $cond: {
              if: {
                $eq: [
                  {
                    $size: {
                      $filter: {
                        input: '$likes',
                        as: 'like',
                        cond: {
                          $eq: ['$$like.profile', userId],
                        },
                      },
                    },
                  },
                  1,
                ],
              },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $unwind: {
          path: '$likes',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'profiles',
          localField: 'likes.profile',
          foreignField: 'id',
          as: 'likes.profile',
        },
      },
      {
        $unwind: {
          path: '$likes.profile',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: '$_id',
          profile: {
            $first: '$profile',
          },
          likes: {
            $push: '$likes',
          },
          content: {
            $first: '$content',
          },
          deletedAt: {
            $first: '$deletedAt',
          },
          createdAt: {
            $first: '$createdAt',
          },
          updatedAt: {
            $first: '$updatedAt',
          },
          countLike: {
            $first: '$countLike',
          },
          countComment: {
            $first: '$countComment',
          },
          isLiked: {
            $first: '$isLiked',
          },
        },
      },
      {
        $sort: {
          _id: -1,
        },
      },
    ];
    $match = payload?._id
      ? {
          _id: { $lt: new ObjectId(payload._id) },
        }
      : {};
    pipelineStage = [
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $match: {
          ...$match,
        },
      },
      ...pipelineStage,
    ];

    return this.postModel.aggregate<Post<Profile>>(pipelineStage);
  }

  async getPost(post: PostInput.GetPost): Promise<Post<Profile>> {
    const pipelineStage: PipelineStage[] = [
      {
        $match: {
          _id: new ObjectId(post._id as string),
        },
      },
      {
        $lookup: {
          from: 'profiles',
          foreignField: 'id',
          localField: 'profile',
          as: 'profile',
        },
      },
      {
        $unwind: {
          path: '$profile',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: 'likes',
          let: {
            id: '$_id',
          },
          pipeline: [
            {
              $addFields: {
                _post: {
                  $toObjectId: '$post',
                },
              },
            },
            {
              $addFields: {
                _deletedAt: {
                  $toString: '$deletedAt',
                },
              },
            },
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ['$_post', '$$id'],
                    },
                    {
                      $eq: ['$_deletedAt', null],
                    },
                  ],
                },
              },
            },
          ],
          as: 'likes',
        },
      },
      {
        $unset: ['likes._post', 'likes._deletedAt'],
      },

      {
        $addFields: {
          countLike: { $size: '$likes' },
        },
      },
    ];

    const result = await this.postModel.aggregate<Post<Profile>>(pipelineStage);

    if (!isEmpty(result)) return result[0];
    return null;
  }
}
