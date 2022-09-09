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
}

export default ProfileInput;
