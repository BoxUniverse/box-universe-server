import { UserInput } from './dto/user.input';
import { RequireAtLeast } from '@pipes/RequireAtLeast.pipe';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './users.schema';
import { UsersService } from '@users/users.service';
import { HttpStatus, UseFilters, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@guards/authJwt.guard';
import Current from '@decorators/Current.decorator';
import { UpdateResult } from 'mongodb';
import { DeleteResult } from '@graphql/types/DeleteResult';
import { File } from '@graphql/types/File';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { S3Service } from '@s3/s3.service';
import { GraphQLException } from '@exceptions/graphql.exception';
import { CreateInput } from '@users/dto/create.input';
import { GraphQLExceptionFilter } from '@filters/graphql.filter';
import { MongooseExceptionFilter } from '@filters/mongoose.filter';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService, private readonly s3Service: S3Service) {}

  @UseFilters(GraphQLExceptionFilter)
  @Mutation(() => File, {
    name: 'uploadImage',
    nullable: true,
  })
  async upload(
    @Args({ name: 'image', type: () => GraphQLUpload }) file: FileUpload,
  ): Promise<File> {
    const { filename, mimetype, encoding, createReadStream } = file;
    const stream = createReadStream();
    const chunks = [];
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      let buffer: Buffer;

      stream.on('data', function (chunk) {
        chunks.push(chunk);
      });

      stream.on('end', function () {
        buffer = Buffer.concat(chunks);
        resolve(buffer);
      });

      stream.on('error', reject);
    });
    if (mimetype.startsWith('image')) {
      this.s3Service.uploadImage({ buffer, filename, mimetype, encoding });
      return { filename, mimetype, encoding };
    } else {
      throw new GraphQLException(
        'File type invalid, please upload only image',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }

  @Query(() => User, {
    name: 'me',
    nullable: true,
  })
  async getMe(@Current() user: User): Promise<User> {
    return user;
  }

  @Query(() => User, {
    name: 'getUser',
    nullable: true,
  })
  async getUser(@Args('userInput', new RequireAtLeast()) userInput: UserInput): Promise<User> {
    return this.usersService.getUser(userInput);
  }

  @Query(() => [User], {
    name: 'getListUsers',
    nullable: true,
  })
  async getListUsers(): Promise<User[]> {
    return this.usersService.getListUsers();
  }

  @Mutation(() => User, {
    name: 'deleteUser',
    nullable: true,
  })
  async deleteUser(@Args('userInput', new RequireAtLeast()) userInput: UserInput): Promise<User> {
    return this.usersService.deleteUser(userInput);
  }

  @Mutation(() => User, {
    name: 'softDeleteUser',
    nullable: true,
  })
  async softDeleteUser(
    @Args('userInput', new RequireAtLeast()) userInput: UserInput,
  ): Promise<UpdateResult> {
    return this.usersService.softDeleteUser(userInput);
  }

  @Mutation(() => DeleteResult, {
    name: 'deleteEntireUser',
    nullable: true,
  })
  async deleteEntireUser() {
    return this.usersService.deleteEntireUser();
  }

  @Mutation(() => User, {
    name: 'createUser',
    nullable: true,
  })
  @UseFilters(MongooseExceptionFilter)
  async createUser(@Args('createInput') createInput: CreateInput): Promise<User> {
    return await this.usersService.createUser(createInput);
  }
}
