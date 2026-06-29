import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AIController } from './ai.controller';
import { AIService } from './ai.service';
import { RecommendationService } from './recommendation.service';
import { EmbeddingsService } from './embeddings.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  imports: [ConfigModule],
  controllers: [AIController],
  providers: [
    AIService,
    RecommendationService,
    EmbeddingsService,
    PrismaService,
  ],
  exports: [AIService, RecommendationService, EmbeddingsService],
})
export class AIModule {}
