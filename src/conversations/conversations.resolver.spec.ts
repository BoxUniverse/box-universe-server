import { Test, TestingModule } from '@nestjs/testing';
import { ConversationsResolver } from '@src/conversations';

describe('ConversationsResolver', () => {
  let resolver: ConversationsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConversationsResolver],
    }).compile();

    resolver = module.get<ConversationsResolver>(ConversationsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
