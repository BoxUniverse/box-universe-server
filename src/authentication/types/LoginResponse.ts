import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '@users/users.schema';

@ObjectType()
export class LoginResponse {
  @Field()
  refreshToken: string;

  @Field(() => User)
  user: Partial<User>;
}
