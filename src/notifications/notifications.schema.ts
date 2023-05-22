import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType, OmitType } from '@nestjs/graphql';
import mongoose, { Document, Types } from 'mongoose';
import { Profile, SimpleProfile } from '@src/profiles';
import { NotificationInput } from '@src/notifications/dto/notifications.input';
import { Post } from '@src/posts';

export type NotificationDocument = Notification & Document;

@ObjectType()
export class PayloadMessageNotification {
  @Field(() => String)
  userAction: string;

  @Field(() => [String], {
    nullable: true,
    defaultValue: [],
  })
  userReceive?: string[];

  @Field(() => String, {
    nullable: true,
  })
  post?: string;

  @Field(() => String, {
    nullable: true,
  })
  conversation?: string;
}

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

  @Field(() => PayloadMessageNotification)
  @Prop({ type: Object, required: true })
  message: PayloadMessageNotification;

  @Field(() => String)
  @Prop({ type: String, required: true })
  type: string;

  @Field(() => String)
  @Prop({ type: String, required: true })
  action: string;

  @Field(() => String)
  @Prop({ type: Boolean, required: true, default: false })
  isRead: boolean;

  // @Field(() => [Profile], { nullable: false })
  // @Prop({ required: true, type: Types.Array<string> })
  // profile: P;

  @Field(() => String, {
    nullable: true,
  })
  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

@ObjectType()
export class NotificationGroup extends OmitType(Notification, ['message'] as const) {
  @Field(() => [String])
  userReceive: string[];

  @Field(() => Post)
  post: Post<Profile>;

  @Field(() => [SimpleProfile])
  groupUserAction: SimpleProfile[];
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
