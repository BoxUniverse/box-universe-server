import { User } from '@users/users.schema';
import { UserInput } from './dto/user.input';
import { UsersRepository } from './users.repository';
import { Injectable } from '@nestjs/common';
import { DeleteResult, ObjectId, UpdateResult } from 'mongodb';
import { CreateInput } from '@users/dto/create.input';
import { OAuthInput } from '@users/dto/oauth.input';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  getUser(userInput: UserInput): Promise<User> {
    return this.usersRepository.getUser(userInput);
  }

  getListUsers(): Promise<User[]> {
    return this.usersRepository.getListUsers();
  }

  createUser(createInput: CreateInput): Promise<User> {
    return this.usersRepository.createUser(createInput);
  }

  deleteUser(userInput: UserInput): Promise<User> {
    return this.usersRepository.deleteUser(userInput);
  }

  softDeleteUser(userInput: UserInput): Promise<UpdateResult> {
    return this.usersRepository.softDeleteUser(userInput);
  }

  deleteEntireUser(): Promise<DeleteResult> {
    return this.usersRepository.deleteEntireUser();
  }

  updateRefreshToken(userId: string | ObjectId, refreshToken: string): Promise<UpdateResult> {
    return this.usersRepository.updateRefreshToken(userId, refreshToken);
  }

  OAuth(_OAuthInput: OAuthInput): Promise<User> {
    return this.usersRepository.OAuth(_OAuthInput);
  }
}
