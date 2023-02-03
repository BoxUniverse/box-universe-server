import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Profile } from '@profiles/profiles.schema';

@ObjectType()
export class FriendsProfile extends PickType(Profile, ['friends'] as const) {}
