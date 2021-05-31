import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseAuthController } from './firebase-auth.controller';

describe('FirebaseAuthController', () => {
  let controller: FirebaseAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FirebaseAuthController],
    }).compile();

    controller = module.get<FirebaseAuthController>(FirebaseAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
