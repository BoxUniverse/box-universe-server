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

  public OAuth(_OAuthInput: OAuthInput): Promise<User | UserOAuth> {
    return this.usersService.OAuth(_OAuthInput);
  }
}
