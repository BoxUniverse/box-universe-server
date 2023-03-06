import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from '@src/s3';
import { UsersResolver, UsersService } from '@src/users';

describe('UserResolver', () => {
  let resolver: UsersResolver;

  const usersService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersResolver,
        S3Service,
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();
    resolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
