import { UserInput } from './dto/user.input';
import { RequireAtLeast } from '@pipes/RequireAtLeast.pipe';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './users.schema';
import { UsersService } from '@users/users.service';
import { UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@guards/auth.guard';
import { UpdateResult } from 'mongodb';
import { DeleteResult } from '@graphql/types/DeleteResult';
import { S3Service } from '@s3/s3.service';
import { CreateInput } from '@users/dto/create.input';
import { MongooseExceptionFilter } from '@filters/mongoose.filter';
import { Authorization } from '@decorators/Authorization.decorator';
import { Current } from '@users/types/UserOAuth';

@Resolver(() => User)
@UseGuards(AuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService, private readonly s3Service: S3Service) {}

  @Query(() => Current, {
    name: 'me',
    nullable: true,
  })
  async getMe(@Authorization() user: Current): Promise<Current> {
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
