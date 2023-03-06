import { Module } from '@nestjs/common';
import { ProfilesModule } from '@src/profiles';
import { FriendProfile, FriendsResolver, FriendsService } from '@src/friends';

@Module({
  providers: [FriendsService, FriendsResolver, FriendProfile],
  imports: [ProfilesModule],
})
export class FriendsModule {}
