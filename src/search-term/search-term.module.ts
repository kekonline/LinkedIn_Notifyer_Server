import { Module } from '@nestjs/common';
import { SearchTermController } from './search-term.controller';
import { SearchTermService } from './search-term.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SearchTerm, SearchTermSchema } from './schemas/search-term.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SearchTerm.name, schema: SearchTermSchema }]),
    UserModule
  ],
  controllers: [SearchTermController],
  exports: [SearchTermService],
  providers: [SearchTermService]
})
export class SearchTermModule { }
