import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from './mail.service';
import { User, UserSchema } from '../user/schemas/user.schema';
import { JobListing, JobListingSchema } from '../job-listing/schemas/job-listing.schema';
import { SearchTerm, SearchTermSchema } from '../search-term/schemas/search-term.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: User.name, schema: UserSchema },
            { name: JobListing.name, schema: JobListingSchema },
            { name: SearchTerm.name, schema: SearchTermSchema },
        ]),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule { }
