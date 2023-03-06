import { Authorization } from '@common/decorators';
import { AuthGuard } from '@common/guards';
import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { Current } from '@src/users';
import { FriendsProfile, FriendsService } from '@src/friends';

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
