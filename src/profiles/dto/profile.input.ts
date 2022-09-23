import { ArgsType, Field, InputType, PartialType } from '@nestjs/graphql';
import { Profile } from '../profiles.schema';

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

  @ArgsType()
  @InputType()
  export class Obtain {
    @Field()
    id: string;
  }
}

export default ProfileInput;
