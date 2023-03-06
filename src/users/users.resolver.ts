import { Authorization } from '@common/decorators';
import { MongooseExceptionFilter } from '@common/filters';
import { DeleteResult } from '@common/graphql';
import { AuthGuard } from '@common/guards';
import { RequireAtLeast } from '@common/pipes';
import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { S3Service } from '@src/s3';
import { CreateInput, Current, User, UserInput, UsersService } from '@src/users';

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
  async softDeleteUser(@Args('userInput', new RequireAtLeast()) userInput: UserInput) {
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
