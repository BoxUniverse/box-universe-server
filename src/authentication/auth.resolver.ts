import { BadRequestException, UseFilters } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '@users/users.schema';
import { UsersService } from '@users/users.service';
import { MongooseExceptionFilter } from '@filters/mongoose.filter';
import { CreateInput } from '@users/dto/create.input';
import { OAuthInput } from '@users/dto/oauth.input';
import * as crypto from 'crypto';
import { LoginInput } from './dto/loginInput.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService, private usersService: UsersService) {}

  // provider with account system
  @Mutation(() => User, {
    name: 'login',
    nullable: true,
  })
  public async login(@Args('loginInput') loginInput: LoginInput) {
    const { username, password, nonce } = loginInput;
    const data = `${username}.${password}.${process.env.SECRET}`;
    const hash = crypto.createHash('md5').update(data).digest('hex');

    if (hash === nonce) return this.authService.validateUser(username, password);
    throw new BadRequestException('Request nonce is invalid');
  }

  // login with provider
  @Mutation(() => User, {
    name: 'OAuth',
    nullable: false,
  })
  public OAuth(@Args('OAuthInput') _OAuthInput: OAuthInput) {
    const { id, provider, nonce } = _OAuthInput;
    const data = `${id}.${provider}.${process.env.SECRET}`;
    const hash = crypto.createHash('md5').update(data).digest('hex');

    if (hash === nonce) return this.authService.OAuth(_OAuthInput);
    else throw new BadRequestException('Error Not Found');
  }

  @Mutation(() => User, {
    name: 'register',
    nullable: false,
  })
  @UseFilters(MongooseExceptionFilter)
  public async register(@Args('createInput') createInput: CreateInput) {
    return await this.usersService.createUser(createInput);
  }
  // @Query(() => AccessTokenResponse, { name: 'refreshAccessToken', nullable: true })
  // public refreshAccessToken(@Args('userInput') userInput: UserInput) {
  //   return this.authService.refreshAccessToken(userInput);
  // }
}
