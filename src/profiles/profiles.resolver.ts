import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { ProfilesService } from '@profiles/profiles.service';
import { Profile } from '@profiles/profiles.schema';
import ProfileInput from '@profiles/dto/profile.input';
import { File } from '@graphql/types/File';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { S3Service } from '@s3/s3.service';
import { GraphQLException } from '@exceptions/graphql.exception';
import { CACHE_MANAGER, HttpStatus, Inject, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Cache } from 'cache-manager';
import { AuthGuard } from '@guards/auth.guard';
import { Authorization } from '@decorators/Authorization.decorator';
import { Current } from '@users/types/UserOAuth';

@Resolver()
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
    this.cacheManager.get<string>('list.profiles', (error, result) => {
      if (!error) return JSON.parse(result);
    });

    return this.profilesService.searchUser({ keyword: '' });
  }
  @Query(() => [Profile])
  async searchUser(
    @Args({ name: 'searchInput', type: () => ProfileInput.Search })
    searchInput: ProfileInput.Search,
  ): Promise<Profile[]> {
    this.cacheManager.get<string>('list.profiles', (error, result) => {
      if (!error) return JSON.parse(result);
    });
    const list = await this.profilesService.searchUser(searchInput);

    this.cacheManager.set('list-profile', JSON.stringify(list), {
      ttl: 60,
    });
    return list;
  }

  @Query(() => Profile)
  async getProfile(
    @Args({ name: 'profileInput', type: () => ProfileInput.Obtain }) profileInput: Partial<Profile>,
  ): Promise<Profile> {
    return this.profilesService.getProfile(profileInput);
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
    console.log(67, 'profiles.resolver.ts', file);

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
}
