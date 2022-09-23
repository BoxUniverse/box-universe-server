import { Query, Resolver, Args } from '@nestjs/graphql';
import { ProfilesService } from './profiles.service';
import { Profile } from '@profiles/profiles.schema';
import ProfileInput from './dto/profile.input';
import { UsersService } from '@users/users.service';

@Resolver()
export class ProfilesResolver {
  constructor(private readonly profilesService: ProfilesService) {}

  @Query(() => [Profile])
  async searchUser(
    @Args({ name: 'searchInput', type: () => ProfileInput.Search })
    searchInput: ProfileInput.Search,
  ): Promise<Profile[]> {
    return this.profilesService.searchUser(searchInput);
  }

  @Query(() => Profile)
  async getProfile(
    @Args({ name: 'profileInput', type: () => ProfileInput.Obtain }) profileInput: Partial<Profile>,
  ): Promise<Profile> {
    return this.profilesService.getProfile(profileInput);
  }
}
