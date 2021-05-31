import { Test, TestingModule } from '@nestjs/testing';
import { StashController } from './stash.controller';

describe('StashController', () => {
  let controller: StashController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StashController],
    }).compile();

    controller = module.get<StashController>(StashController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
