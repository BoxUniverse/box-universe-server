import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';

namespace ProfileInput {
  @ArgsType()
  @InputType()
  export class Create {
    @Field()
    id: string;

    @Field()
    email: string;

    @Field()
    provider: string;

    @Field()
    name: string;
  }
  @ArgsType()
  @InputType()
  export class Search {
    @Field()
    keyword: string;
  }

  @ArgsType()
  @InputType()
  export class Obtain {
    @Field()
    id: string;
  }
}

export default ProfileInput;
