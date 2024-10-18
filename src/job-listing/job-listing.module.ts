import { Module, forwardRef } from '@nestjs/common';
import { JobListingController } from './job-listing.controller';
import { JobListingService } from './job-listing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JobListing, JobListingSchema } from './schemas/job-listing.schema';
import { UserModule } from '../user/user.module';
import { SearchTermModule } from '../search-term/search-term.module';
import { SearchTerm, SearchTermSchema } from '../search-term/schemas/search-term.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: JobListing.name, schema: JobListingSchema }, { name: SearchTerm.name, schema: SearchTermSchema }]), UserModule, SearchTermModule, forwardRef(() => JobListingModule),],
  providers: [JobListingService],
  controllers: [JobListingController],
  exports: [JobListingService, MongooseModule],
})
export class JobListingModule { }
