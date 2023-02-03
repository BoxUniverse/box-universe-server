import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import mongoose from 'mongoose';
import { Friend } from '@src/friends/friends.schema';

export type ProfileDocument = Profile & mongoose.Document;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  }
})
@ObjectType()
export class Profile {
  @Prop()
  @Field(() => String)
  id: string;

  @Prop()
  @Field(() => String)
  name: string;

  @Prop()
  @Field(() => String)
  email: string;

  @Prop({ default: `${process.env.DEFAULT_AVATAR}` })
  @Field(() => String)
  avatar: string;

  @Prop()
  @Field(() => String)
  provider: string;

  @Prop({ default: [], type: Array<Friend>, ref: 'Friend' })
  @Field(() => [Profile])
  friends: Friend[];
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
ProfileSchema.index({ email: 1, provider: 1 }, { unique: true });
