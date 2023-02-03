import { Authorization } from '@decorators/Authorization.decorator';
import { Current } from '@users/types/UserOAuth';
import { AuthGuard } from '@guards/auth.guard';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { ProfilesService } from '@profiles/profiles.service';
import { FriendsProfile } from './types';
import { FriendsService } from './friends.service';

@Resolver()
@UseGuards(AuthGuard)
export class FriendsResolver {
  constructor(private readonly friendsService: FriendsService) {}

  @Query(() => FriendsProfile, { nullable: true })
  async getEntireFriends(
    @Authorization()
    user: Current,
  ): Promise<FriendsProfile> {
    const id = user.sub;
    return this.friendsService.getEntireFriends(id);
  }
}
