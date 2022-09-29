import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import mongoose, { Types } from 'mongoose';
import { Provider } from '@users/users.type';

export type UserDocument = User & mongoose.Document;

@Schema({
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
})
@ObjectType()
export class User {
  @Field(() => ID, { nullable: false })
  _id: ObjectId;


  @Field({ nullable: true })
  @Prop({ required: [true, 'This field shoud not be empty'], sparse: true })
  username: string;

  @Field({ nullable: true })
  @Prop({ required: [true, 'This field shoud not be empty'] })
  password: string;

  @Field({ nullable: false })
  @Prop({ required: [true, 'This field shoud not be empty'], unique: true })
  email: string;

  @Field({ nullable: true })
  @Prop({ required: false })
  refreshToken: string;

  @Field(() => [Provider])
  @Prop({ default: {}, type: Types.Array<Provider>  })
  providers: Array<Provider>;

  @Field(() => String)
  @Prop({ default: null, type: Date })
  deletedAt: Date;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
