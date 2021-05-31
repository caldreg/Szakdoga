import { Test, TestingModule } from '@nestjs/testing';
import { JenkinsConstantsService } from './jenkins-constants.service';

describe('JenkinsConstantsService', () => {
  let service: JenkinsConstantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JenkinsConstantsService],
    }).compile();

    service = module.get<JenkinsConstantsService>(JenkinsConstantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
