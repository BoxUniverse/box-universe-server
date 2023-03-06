import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

export type FriendDocument = FriendProfile & mongoose.Document;

@Schema()
@ObjectType()
export class FriendProfile {
  @Prop()
  @Field(() => String, {
    nullable: true,
  })
  friendId: string;
}

export const FriendSchema = SchemaFactory.createForClass(FriendProfile);
