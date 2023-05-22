import { ArgsType, Field, InputType, ObjectType } from '@nestjs/graphql';
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

  @ObjectType()
  @InputType()
  export class PaginationComment {
    @Field(() => String, {
      description: 'id post',
    })
    post: string | ObjectId;

    @Field(() => String, {
      description: 'continue id comment',
      nullable: true,
    })
    startValue?: string | ObjectId;
  }
}
