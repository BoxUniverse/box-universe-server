import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@users/users.schema';

@ObjectType()
export class RegisterResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
