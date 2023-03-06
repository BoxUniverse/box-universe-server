import { Field, IntersectionType, ObjectType } from '@nestjs/graphql';
import { User } from '@src/users';

export type UserOAuth = User & { provider: string; id: string };

@ObjectType()
class OAuthInfo {
  @Field()
  name: string;

  @Field()
  picture: string;

  @Field({
    name: 'id',
    description: 'id',
  })
  sub: string;
}

@ObjectType()
export class Current extends IntersectionType(User, OAuthInfo) {}
