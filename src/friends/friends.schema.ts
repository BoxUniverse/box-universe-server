import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import mongoose from 'mongoose';

export type FriendDocument = Friend & mongoose.Document;

@Schema()
@ObjectType()
export class Friend {
  @Prop()
  @Field(() => String)
  friendId: string;

  @Prop({ default: false })
  @Field(() => Boolean)
  isBlock: boolean;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
