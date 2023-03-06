import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

export namespace ProfileInput {
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

  @ArgsType()
  @InputType()
  export class _Upload_ {
    @Field(() => GraphQLUpload)
    file: FileUpload;

    @Field(() => String)
    id: string;
  }

  @ArgsType()
  @InputType()
  export class Friend {
    @Field()
    userId: string;
    @Field()
    friendId: string;
  }
}
