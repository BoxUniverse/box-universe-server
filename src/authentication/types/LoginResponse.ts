import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@src/users';

@ObjectType()
export class LoginResponse {
  @Field()
  refreshToken: string;

  @Field(() => User)
  user: Partial<User>;
}
