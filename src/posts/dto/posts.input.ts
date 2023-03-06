import { IsObjectId } from '@decorators/IsObjectId.decorator';
import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
// import { Post } from '@src/posts';
import { IsOptional } from 'class-validator';
import { Post } from '@src/posts';

export namespace PostInput {
  @ObjectType()
  export class PostDto {
    @Field(() => String, {
      description: 'content of post',
      nullable: false,
    })
    content: string;

    @Field(() => Number, {
      description: 'count like of post',
      nullable: true,
    })
    countLike?: number;

    @Field(() => String, {
      description: 'profile of post',
      nullable: false,
    })
    @IsObjectId()
    profile: string;
  }

  @InputType()
  @ArgsType()
  export class CreatePost extends OmitType(PartialType(PostDto, InputType), ['profile'] as const) {}

  @InputType()
  @ArgsType()
  export class UpdatePost extends PartialType(PostDto, InputType) {}

  @InputType()
  @ArgsType()
  export class DeletePost extends PickType(Post, ['_id'] as const, InputType) {}

  @InputType()
  @ArgsType()
  export class GetPost extends PickType(Post, ['_id'] as const, InputType) {}

  @InputType()
  @ArgsType()
  export class InteractPost extends PickType(Post, ['_id'] as const, InputType) {}

  @InputType()
  @ArgsType()
  export class GetPosts {
    @IsOptional()
    @Field(() => String, {
      nullable: true,
      defaultValue: null,
    })
    _id: string;
  }
}
