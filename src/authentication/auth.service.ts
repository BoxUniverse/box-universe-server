import { Injectable } from '@nestjs/common';
import { OAuthInput, User, UserOAuth, UsersService } from '@src/users';
import { compareSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.getUser({ username });

    const isCorrect = compareSync(password, user?.password || '');
    if (user && isCorrect) {
      //

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
