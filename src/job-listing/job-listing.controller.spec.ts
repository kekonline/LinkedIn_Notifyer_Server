import { Test, TestingModule } from '@nestjs/testing';
import { JobListingController } from './job-listing.controller';

describe('JobListingController', () => {
  let controller: JobListingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobListingController],
    }).compile();

    controller = module.get<JobListingController>(JobListingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
