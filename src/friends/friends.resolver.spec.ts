import { Test, TestingModule } from '@nestjs/testing';
import { FriendsResolver } from './friends.resolver';

describe('FriendsResolver', () => {
  let resolver: FriendsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendsResolver],
    }).compile();

    resolver = module.get<FriendsResolver>(FriendsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
