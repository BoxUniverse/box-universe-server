import { Authorization } from '@common/decorators';
import { MongooseExceptionFilter } from '@common/filters';
import { DeleteResult } from '@common/graphql';
import { AuthGuard } from '@common/guards';
import { RequireAtLeast } from '@common/pipes';
import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { S3Service } from '@src/s3';
import { Current, User, UserInput, UsersService } from '@src/users';

@Resolver(() => User)
@UseGuards(AuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

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
  async getUser(
    @Args('getUserInput', new RequireAtLeast()) userInput: UserInput.GetUser,
  ): Promise<User> {
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
  async deleteUser(
    @Args('deleteUserInput', new RequireAtLeast()) userInput: UserInput.DeleteUser,
  ): Promise<User> {
    return this.usersService.deleteUser(userInput);
  }

  @Mutation(() => User, {
    name: 'softDeleteUser',
    nullable: true,
  })
  async softDeleteUser(
    @Args('deleteUserInput', new RequireAtLeast()) userInput: UserInput.DeleteUser,
  ) {
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
  async createUser(@Args('createUserInput') createInput: UserInput.CreateUser): Promise<User> {
    return await this.usersService.createUser(createInput);
  }
}
