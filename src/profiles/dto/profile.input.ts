import { ArgsType, Field, InputType } from '@nestjs/graphql';

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
  }

  @ArgsType()
  @InputType()
  export class Search {
    @Field()
    keyword: string;
  }
}

export default ProfileInput;
