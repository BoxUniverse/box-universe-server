import { createUnionType, Field, ID, ObjectType, Union } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Post } from '@src/posts';
import { Profile } from '@src/profiles';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';
import { postMiddleware } from '@common/graphql';
import { FriendProfile } from '@src/friends';

export type CommentDocument = Comment & mongoose.Document;
@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
@ObjectType()
export class Comment<
  PF extends Profile | Profile<Profile[]> | string = string,
  P extends Post | Post<Profile> | string = string,
> {
  @Field(() => ID)
  _id?: ObjectId | string;

  @Prop({ required: true, type: String })
  @Field(() => Profile)
  profile: PF;

  @Prop({ required: true, type: String })
  @Field(() => Post, {
    middleware: [postMiddleware],
    description: 'if type of this field is string, only get _id, which is returned from middleware',
  })
  post: P;

  @Prop({ required: true, type: String })
  @Field(() => String)
  text: string;

  @Prop({ type: Date })
  @Field(() => String)
  deletedAt: Date;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}
export const UnionPost = createUnionType({
  name: 'UnionPost',
  types: () => [Post, String] as const,
  resolveType: (value) => {
    if ('_id' in value) {
      return Post;
    }
    return 'Profile';
  },
});

export const CommentSchema = SchemaFactory.createForClass(Comment);
