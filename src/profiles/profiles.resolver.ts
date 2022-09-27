import { Query, Resolver, Args, Mutation } from '@nestjs/graphql';
import { ProfilesService } from '@profiles/profiles.service';
import { Profile } from '@profiles/profiles.schema';
import ProfileInput from '@profiles/dto/profile.input';
import { File } from '@graphql/types/File';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { S3Service } from '@s3/s3.service';
import { GraphQLException } from '@exceptions/graphql.exception';
import { HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Resolver()
export class ProfilesResolver {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly s3Service: S3Service,
    @InjectQueue('profile-queue') private readonly profileQueue: Queue,
  ) {}

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
        this.profileQueue.add('updateAvatar', { url, id });

        return { url, filename, mimetype, encoding };
      } else {
        throw new NotFoundException();
      }
    } else {
      throw new GraphQLException(
        'File type invalid, please upload only image',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
}
