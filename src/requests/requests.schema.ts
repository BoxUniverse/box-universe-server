import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import mongoose, { ObjectId } from 'mongoose';
import { Profile } from '@profiles/profiles.schema';

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
@ObjectType()
export class Request {
  @Field(() => ID, { nullable: false })
  _id?: ObjectId;

  @Prop({ required: true })
  @Field(() => Profile)
  userRequest: string;

  @Prop({ required: true })
  @Field(() => Profile)
  userReceive: string;

  @Prop({ required: true, default: false })
  @Field(() => Boolean)
  isAccept?: boolean;

  @Prop({ required: true, default: false })
  @Field(() => Boolean)
  isReject?: boolean;

  @Prop({ required: true, default: true })
  @Field(() => Boolean)
  isPending?: boolean;
}

export type RequestDocument = Request & mongoose.Document;
export const RequestSchema = SchemaFactory.createForClass(Request);
RequestSchema.index({ userRequest: 1, userReceive: 1 }, { unique: true });
