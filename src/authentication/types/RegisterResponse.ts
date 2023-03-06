import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@src/users';

@ObjectType()
export class RegisterResponse {
  @Field()
  accessToken: string;

  @Field(() => User)
  user: User;
}
