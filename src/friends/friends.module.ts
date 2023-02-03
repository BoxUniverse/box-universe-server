import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsResolver } from './friends.resolver';
import { ProfilesModule } from '@profiles/profiles.module';

@Module({
  providers: [FriendsService, FriendsResolver],
  imports: [ProfilesModule],
})
export class FriendsModule {}
