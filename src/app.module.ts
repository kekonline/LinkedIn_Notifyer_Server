import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { SearchTermModule } from './search-term/search-term.module';
import { JobListingModule } from './job-listing/job-listing.module';
import { MailModule } from './mail/mail.module';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/LinkedIn_Notifyer',
    ),
    UserModule,
    SearchTermModule,
    JobListingModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }
