import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DynamicProfile, Profile } from '@src/profiles';
import mongoose, { ObjectId } from 'mongoose';

export type PostDocument = Post<string> & mongoose.Document;

@ObjectType()
@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
export class Post<PF extends DynamicProfile = string> {
  @Field(() => ID, { nullable: true })
  _id?: ObjectId | string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: true })
  content: string;

  @Field(() => Profile, {
    nullable: false,
  })
  @Prop({ type: String, required: true })
  profile: PF;

  @Field(() => Number)
  countLike: number;

  @Field(() => Number)
  countComment: number;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;

  @Field(() => String)
  @Prop({ type: Date, default: null })
  deletedAt: string;

  @Field(() => Boolean)
  isLiked: boolean;

  @Field(() => [Profile])
  likes: Profile[];
}

export type DynamicPost = Post | Post<Profile> | string;

export const PostSchema = SchemaFactory.createForClass(Post);
