import { Module } from '@nestjs/common';
import { JobListingService } from './job-listing.service';
import { JobListingController } from './job-listing.controller';

@Module({
  providers: [JobListingService],
  controllers: [JobListingController]
})
export class JobListingModule {}
