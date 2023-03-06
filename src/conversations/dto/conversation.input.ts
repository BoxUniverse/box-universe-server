import { ArgsType, Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Conversation } from '@src/conversations';

import { Profile } from '@src/profiles';
import { IsOptional } from 'class-validator';

export namespace ConversationInput {
  @ArgsType()
  @InputType()
  export class CreateConversation {
    @Field(() => [String])
    members: Array<string>;

    @Field(() => String)
    @IsOptional()
    name?: string;
  }

  @ObjectType()
  export class ListFriendNotInConversation {
    @Field(() => [Profile])
    result: Profile[];
  }

  @ArgsType()
  @InputType()
  export class ChangeNameConversation extends PickType(
    Conversation,
    ['_id', 'name'] as const,
    InputType,
  ) {}
}

export default ConversationInput;
