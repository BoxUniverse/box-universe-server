import { IsObjectId } from '@decorators/IsObjectId.decorator';
import { ArgsType, Field, ID, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

export namespace MessageInput {
  @ArgsType()
  @InputType()
  export class Send {
    @Field()
    @IsString()
    message: string;

    @Field(() => ID)
    @IsObjectId()
    conversationId: string;

    @Field(() => Number)
    now: number | string;
  }

  @ArgsType()
  @InputType()
  export class SendFiles {
    @Field(() => ID)
    @IsObjectId()
    conversationId: string;

    @Field(() => Number)
    now: number | string;
  }

  @ArgsType()
  @InputType()
  export class PaginationMessages {
    @Field()
    @IsString()
    @IsObjectId()
    conversationId: string;

    @Field(() => ID, { nullable: true })
    startValue: any;
  }
}

export default MessageInput;
