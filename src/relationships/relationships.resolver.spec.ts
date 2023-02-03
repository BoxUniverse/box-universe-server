import { Test, TestingModule } from '@nestjs/testing';
import { RelationshipsResolver } from './relationships.resolver';

describe('RelationshipsResolver', () => {
  let resolver: RelationshipsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RelationshipsResolver],
    }).compile();

    resolver = module.get<RelationshipsResolver>(RelationshipsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
