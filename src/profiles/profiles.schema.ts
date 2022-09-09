import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import mongoose from 'mongoose';

export type ProfileDocument = Profile & mongoose.Document;

@Schema()
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

  @Prop()
  @Field(() => String)
  provider: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
ProfileSchema.index({ email: 1, provider: 1 }, { unique: true });
