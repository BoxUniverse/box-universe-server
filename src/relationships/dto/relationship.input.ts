import { ArgsType, Field, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsString } from 'class-validator';

namespace RelationshipInput {
  @InputType()
  @ArgsType()
  export class Create {
    @Field(() => ID)
    @IsString()
    friendId: string;
  }

  @InputType()
  @ArgsType()
  export class Info {
    @Field(() => ID)
    @IsString()
    friendId: string;
  }

  @InputType()
  @ArgsType()
  export class Status {
    @Field(() => Boolean)
    @IsBoolean()
    isPending: boolean;

    @Field(() => Boolean)
    @IsBoolean()
    isBlock: boolean;
  }
}

export default RelationshipInput;
