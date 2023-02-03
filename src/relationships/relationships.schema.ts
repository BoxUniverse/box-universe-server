import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import mongoose from 'mongoose';

@Schema()
@ObjectType()
export class Relationship {
  @Prop({ required: true })
  @Field(() => String)
  userId: string;

  @Prop({ required: true })
  @Field(() => String)
  friendId: string;

  @Prop({ required: true, default: false })
  @Field(() => Boolean)
  isBlock?: boolean;
}

export type RelationshipDocument = Relationship & mongoose.Document;
export const RelationshipSchema = SchemaFactory.createForClass(Relationship);
RelationshipSchema.index({ userId: 1, friendId: 1 }, { unique: true });
