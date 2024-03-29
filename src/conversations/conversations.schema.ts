import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Profile } from '@src/profiles';
import mongoose, { ObjectId } from 'mongoose';

export type ConversationDocument = Conversation & mongoose.Document;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
@ObjectType()
export class Conversation<M extends string | Profile | Profile<Profile[]> = string> {
  @Field(() => ID, { nullable: false })
  _id?: ObjectId;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  name: string;

  @Prop({ required: true, type: () => [String], ref: 'Friend' })
  @Field(() => [Profile])
  members: M[];
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
