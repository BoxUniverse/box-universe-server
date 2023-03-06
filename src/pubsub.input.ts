import { ArgsType, Field, ID, InputType } from '@nestjs/graphql';

@InputType()
@ArgsType()
export class PublisherSubscriptions {
  @Field(() => ID)
  id: string;
}
