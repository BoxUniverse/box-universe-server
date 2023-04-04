import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { Document, Types } from 'mongoose';
import { Profile } from '@src/profiles';

export type NotificationDocument = Notification & Document;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
@ObjectType()
export class Notification<P extends Profile | string[] = string[]> {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  body: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  type: string;

  @Field(() => String)
  @Prop({ type: String, required: true, defaultValue: false })
  isRead: boolean;

  @Field(() => [Profile], { nullable: false })
  @Prop({ required: true, type: Types.Array<string> })
  profile: P;

  @Field(() => String)
  @Prop({ type: Date, default: null })
  deleteAt: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
