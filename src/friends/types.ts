import { ObjectType, PickType } from '@nestjs/graphql';
import { Profile } from '@src/profiles';

@ObjectType()
export class FriendsProfile extends PickType(Profile, ['friends'] as const, ObjectType) {}
