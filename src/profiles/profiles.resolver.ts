import { GraphQLException } from '@common/exceptions';
import { AuthGuard } from '@common/guards';
import { File } from '@common/graphql';
import { InjectQueue } from '@nestjs/bull';
import { CACHE_MANAGER, HttpStatus, Inject, NotFoundException, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { S3Service } from '@src/s3';
import { Profile, ProfileInput, ProfilesService } from '@src/profiles';
import { Queue } from 'bull';
import { Cache } from 'cache-manager';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver(Profile)
@UseGuards(AuthGuard)
export class ProfilesResolver {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly s3Service: S3Service,
    @InjectQueue('profile-queue') private readonly profileQueue: Queue,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Query(() => [Profile])
  async getEntireProfile(): Promise<Profile[]> {
    const result = await this.cacheManager.get<string>('list.profiles');
    if (result) return JSON.parse(result);

    return this.profilesService.searchUser({ keyword: '' });
  }

  @Query(() => [Profile])
  async searchUser(
    @Args({ name: 'searchInput', type: () => ProfileInput.Search })
    searchInput: ProfileInput.Search,
  ): Promise<Profile[]> {
    const result = await this.cacheManager.get<string>('list.profiles');
    if (result) return JSON.parse(result);
    const list = await this.profilesService.searchUser(searchInput);
    await this.cacheManager.set('list-profile', JSON.stringify(list), 60);
    return list;
  }

  @Query(() => Profile)
  async getProfile(
    @Args({ name: 'profileInput', type: () => ProfileInput.Obtain }) profileInput: Partial<Profile>,
  ): Promise<Profile> {
    return this.profilesService.getProfile(profileInput);

    //
  }

  @Mutation(() => File, {
    name: 'uploadAvatar',
    nullable: true,
  })
  async uploadAvatar(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
    @Args({ name: 'id', type: () => String }) id: string,
  ): Promise<File> {
    const { mimetype, filename, encoding } = file;

    if (mimetype.startsWith('image')) {
      const url = await this.s3Service.uploadImage(file);
      if (typeof url === 'string') {
        this.profileQueue.add(
          'updateAvatar',
          { url, id },
          { removeOnComplete: true, removeOnFail: true },
        );

        return { url, filename, mimetype, encoding };
      } else throw new NotFoundException();
    } else {
      throw new GraphQLException(
        'File type invalid, please upload only image',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  @Mutation(() => Number, {
    name: 'unfriend',
    nullable: true,
  })
  async unfriend(
    @Args({ name: 'friend', type: () => ProfileInput.Friend }) friend: ProfileInput.Friend,
  ): Promise<number> {
    return this.profilesService.unFriend(friend.userId, friend.friendId);
  }

  // @ResolveField(() => [UnionFriend], {
  //   name: 'friends',
  //   nullable: true,
  // })
  // _friends(@Parent() profile: Profile) {
  //   //
  //   //
  //   // return FriendProfile;
  //   // return profile.friends;
  // }
}
