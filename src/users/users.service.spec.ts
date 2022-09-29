import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

describe('UserResolver', () => {
  let resolver: UsersService;

  const usersRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: usersRepository,
        },
      ],
    }).compile();
    resolver = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
