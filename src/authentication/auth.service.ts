import { Injectable } from '@nestjs/common';
import { User } from '@users/users.schema';
import { UsersService } from '@users/users.service';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './types/LoginResponse';
import { UserInput } from '@users/dto/user.input';
import { OAuthInput } from '@users/dto/oauth.input';
import { Payload } from './types/Payload';
import { UserOAuth } from '@src/users/types/UserOAuth';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.getUser({ username });

    const isCorrect = compareSync(password, user?.password || '');
    if (user && isCorrect) {
      // console.log(user);

      // const {
      //   password: {},
      //   ...result
      // } = user;
      return user;
    } else {
      return null;
    }
  }
  // public login(user: Partial<User>): LoginResponse {
  //   const payload: Payload = {
  //     _id: user._id,
  //     username: user.username,
  //     email: user.email,
  //     sub: user._id,
  //   };
  //
  //   const refreshToken = 'xx';
  //   // this.usersService.updateRefreshToken(user._id, refreshToken);
  //   return { user, refreshToken };
  // }

  public OAuth(_OAuthInput: OAuthInput): Promise<User | UserOAuth> {
    return this.usersService.OAuth(_OAuthInput);
  }
  // public async refreshAccessToken(userInput: UserInput) {
  //   const { _id, refreshToken } = userInput;
  //   const user = await this.usersService.getUser({ _id });
  //   const payload: Payload = {
  //     _id: user._id,
  //     username: user.username,
  //     email: user.email,
  //     sub: user._id,
  //   };
  //
  //   if (user.refreshToken === refreshToken)
  //     return {
  //       accessToken: this.jwtService.sign(payload, {
  //         expiresIn: process.env.TIME_EXPIRE_ACCESS_TOKEN,
  //       }),
  //     };
  //   return null;
  // }
}
