import { BadRequestException, UseFilters, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserInput } from '@users/dto/user.input';
import { LocalAuthGuard } from 'src/common/guards/authLocal.guard';
import { AuthService } from './auth.service';
import { LoginResponse } from './types/LoginResponse';
import { AccessTokenResponse } from './types/AccessTokenResponse';
import { User } from '@users/users.schema';
import { UsersService } from '@users/users.service';
import { MongooseExceptionFilter } from '@filters/mongoose.filter';
import { CreateInput } from '@users/dto/create.input';
import { OAuthInput } from '@users/dto/oauth.input';
import * as crypto from 'crypto';
@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  @Mutation(() => LoginResponse, {
    name: 'login',
    nullable: true,
  })
  @UseGuards(LocalAuthGuard)
  public login(@Args('userInput') userInput: UserInput, @Context() context: any) {
    return this.authService.login(context.user._doc);
  }

  @Mutation(() => User, {
    name: 'OAuth',
    nullable: false,
  })
  public OAuth(@Args('OAuthInput') _OAuthInput: OAuthInput) {
    const { username, email, id, provider, nonce } = _OAuthInput;
    const input = JSON.stringify({
      username,
      email,
      provider,
    });
    const data = `${id}.${provider}.${process.env.SECRET}`;
    const hash = crypto.createHash('md5').update(data).digest('hex');

    if (hash === nonce) return this.authService.OAuth(_OAuthInput);
    else throw new BadRequestException();
  }

  @Mutation(() => User, {
    name: 'register',
    nullable: false,
  })
  @UseFilters(MongooseExceptionFilter)
  public async register(@Args('createInput') createInput: CreateInput) {
    return await this.usersService.createUser(createInput);
  }
  @Query(() => AccessTokenResponse, { name: 'refreshAccessToken', nullable: true })
  public refreshAccessToken(@Args('userInput') userInput: UserInput) {
    return this.authService.refreshAccessToken(userInput);
  }
}
