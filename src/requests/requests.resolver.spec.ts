import { Test, TestingModule } from '@nestjs/testing';
import { RequestsResolver } from '@src/requests';

describe('RequestsResolver', () => {
  let resolver: RequestsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestsResolver],
    }).compile();

    resolver = module.get<RequestsResolver>(RequestsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
