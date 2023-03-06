import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { DynamicProfile, Profile } from '@src/profiles';
import mongoose, { ObjectId } from 'mongoose';

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
@ObjectType()
export class Request<RQ extends DynamicProfile = string, RC extends DynamicProfile = string> {
  @Field(() => ID, { nullable: false })
  _id?: ObjectId;

  @Prop({ type: String, required: true })
  @Field(() => Profile)
  userRequest: RQ;

  @Prop({ type: String, required: true })
  @Field(() => Profile)
  userReceive: RC;

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
