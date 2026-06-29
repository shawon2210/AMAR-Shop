import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { EnhancedSearchService } from './enhanced-search.service';
import { SearchAnalyticsService } from './search-analytics.service';
import { PrismaService } from '../../common/prisma.service';
import { EmbeddingsService } from '../ai/embeddings.service';
import { AIService } from '../ai/ai.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [SearchController],
  providers: [
    SearchService,
    EnhancedSearchService,
    SearchAnalyticsService,
    PrismaService,
    EmbeddingsService,
    AIService,
  ],
  exports: [SearchService, EnhancedSearchService, SearchAnalyticsService],
})
export class SearchModule {}
