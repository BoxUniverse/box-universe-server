import { Field, ID, ObjectType, OmitType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DynamicProfile, Profile } from '@src/profiles';
import mongoose, { ObjectId } from 'mongoose';

export type MessageDocument = Message & mongoose.Document;

@ObjectType()
export class FileInfo {
  @Field(() => String)
  url: string;

  @Field(() => String)
  type: string;
}

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: false,
  },
})
@ObjectType()
export class Message<S extends DynamicProfile = string> {
  @Field(() => ID, { nullable: true })
  _id?: ObjectId;

  @Field(() => Profile, { nullable: false })
  @Prop({ type: String, required: true })
  sender: S;

  @Field(() => ID, { nullable: false })
  @Prop({ type: String, required: true })
  conversation: string;

  @Field(() => String, { nullable: true })
  @Prop({ type: String, required: false })
  message: string;

  @Field(() => [FileInfo], { nullable: true })
  @Prop({ required: false })
  files: FileInfo[];

  @Field(() => String, { nullable: false })
  @Prop({ type: String, required: true })
  type: string;

  @Field(() => String)
  createdAt: string;
}

@ObjectType()
export class MessageOmit extends OmitType(Message, ['conversation'] as const) {}

@ObjectType()
export class MessagesConversation {
  @Field(() => ID)
  _id: string;

  @Field(() => [MessageOmit])
  messages: Omit<Message, 'conversation'>;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
