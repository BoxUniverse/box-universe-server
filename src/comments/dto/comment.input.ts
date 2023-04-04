import { Field, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongodb';
import { IsObjectId } from '@common/decorators';

export namespace CommentInput {
  @ObjectType()
  export class ProfilesCommentedPost {
    @Field(() => String, {
      description: 'id post ',
    })
    @IsObjectId()
    _id: string | ObjectId;

    @Field(() => [String], {
      description: 'list profile id unique commented in post',
    })
    profiles: string[];
  }
}
