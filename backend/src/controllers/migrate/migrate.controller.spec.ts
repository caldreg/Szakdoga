import { Test, TestingModule } from '@nestjs/testing';
import { MigrateController } from './migrate.controller';

describe('MigrateController', () => {
  let controller: MigrateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MigrateController],
    }).compile();

    controller = module.get<MigrateController>(MigrateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
