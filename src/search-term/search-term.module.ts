import { Module } from '@nestjs/common';
import { SearchTermController } from './search-term.controller';
import { SearchTermService } from './search-term.service';

@Module({
  controllers: [SearchTermController],
  providers: [SearchTermService]
})
export class SearchTermModule {}
