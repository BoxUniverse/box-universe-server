import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DynamicPost, Post } from '@src/posts';
import { DynamicProfile, Profile } from '@src/profiles';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

export type LikeDocument = Like & Document;
@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'createdAt',
  },
})
@ObjectType()
export class Like<PF extends DynamicProfile = string, P extends DynamicPost = string> {
  @Field(() => ID)
  _id?: ObjectId | string;

  @Prop({ required: true, type: String })
  @Field(() => Profile)
  profile: PF;

  @Prop({ required: true, type: String })
  @Field(() => Post)
  post: P;

  @Prop({ type: Date })
  @Field(() => String)
  deletedAt: Date;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}

export type DynamicLike = Like | Like<Profile> | string;
export const LikeSchema = SchemaFactory.createForClass(Like);
LikeSchema.index({ profile: 1, post: 1 }, { unique: true });
