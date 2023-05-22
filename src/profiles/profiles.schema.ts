import { createUnionType, Field, ObjectType, OmitType, PickType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { FriendProfile } from '../friends/friends.schema';
// import { FriendProfile } from '@src/friends';

export type ProfileDocument = Profile<FriendProfile[]> & mongoose.Document;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
@ObjectType()
export class Profile<F extends Profile[] | FriendProfile[] = FriendProfile[]> {
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
  @Field(() => String, { nullable: true })
  provider: string;

  @Prop({ default: [], type: Array<FriendProfile> })
  @Field(() => [UnionFriend], { nullable: true })
  friends: F;
}

@ObjectType()
export class SimpleProfile extends PickType(Profile, ['avatar', 'email', 'name', 'id'] as const) {}

export const UnionFriend = createUnionType({
  name: 'UnionFriend',
  types: () => [Profile, FriendProfile] as const,
  resolveType: (value) => {
    if ('_id' in value) {
      return Profile;
    }
    if ('friendId' in value) {
      return FriendProfile;
    }
  },
});

export type DynamicProfile = Profile | Profile<Profile[]> | string;
export const ProfileSchema = SchemaFactory.createForClass(Profile);

ProfileSchema.index({ email: 1, provider: 1 }, { unique: true });
