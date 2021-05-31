import { Test, TestingModule } from '@nestjs/testing';
import { StashService } from './stash.service';

describe('StashService', () => {
  let service: StashService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StashService],
    }).compile();

    service = module.get<StashService>(StashService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
