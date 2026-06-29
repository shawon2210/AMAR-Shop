import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AIService } from './ai.service';
import { RecommendationService } from './recommendation.service';
import { EmbeddingsService } from './embeddings.service';
import { PrismaService } from '../../common/prisma.service';
import type { ProductDescriptionRequest } from './interfaces/ai.interface';

@Controller('api/ai')
export class AIController {
  constructor(
    private readonly aiService: AIService,
    private readonly recommendationService: RecommendationService,
    private readonly embeddingsService: EmbeddingsService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SELLER', 'ADMIN')
  @Post('describe-product')
  async describeProduct(@Body() body: ProductDescriptionRequest) {
    return {
      description: await this.aiService.generateProductDescription(body),
    };
  }

  @Post('summarize-reviews')
  async summarizeReviews(
    @Body()
    body: {
      reviews: Array<{ rating: number; comment: string; date: string }>;
    },
  ) {
    return {
      summary: await this.aiService.summarizeReviews({ reviews: body.reviews }),
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('chat')
  async chat(
    @Request() req: any,
    @Body()
    body: {
      message: string;
      history?: Array<{ role: string; content: string }>;
    },
  ) {
    return this.aiService.chatWithAssistant(
      req.user.id,
      body.message,
      body.history,
    );
  }

  @Post('moderate')
  async moderate(@Body() body: { text: string }) {
    return this.aiService.moderateContent(body.text);
  }

  @Post('forecast')
  async forecast(@Body() body: { productId: string; days?: number }) {
    return this.aiService.forecastDemand(body.productId, body.days || 30);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('recommendations/feed')
  async getFeed(@Request() req: any, @Query('limit') limit?: string) {
    return this.recommendationService.getPersonalizedFeed(
      req.user.id,
      limit ? parseInt(limit) : 20,
    );
  }

  @Get('recommendations/frequently-bought/:productId')
  async getFrequentlyBought(
    @Query('productId') productId: string,
    @Query('limit') limit?: string,
  ) {
    return this.recommendationService.getFrequentlyBoughtTogether(
      productId,
      limit ? parseInt(limit) : 6,
    );
  }

  @Get('recommendations/cross-sell/:productId')
  async getCrossSell(
    @Query('productId') productId: string,
    @Query('limit') limit?: string,
  ) {
    return this.recommendationService.getCrossSellItems(
      productId,
      limit ? parseInt(limit) : 6,
    );
  }

  @Get('recommendations/upsell/:productId')
  async getUpsell(
    @Query('productId') productId: string,
    @Query('limit') limit?: string,
  ) {
    return this.recommendationService.getUpsellItems(
      productId,
      limit ? parseInt(limit) : 6,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('track-interaction')
  async trackInteraction(
    @Request() req: any,
    @Body()
    body: {
      productId: string;
      action: 'view' | 'add_to_cart' | 'purchase' | 'wishlist';
    },
  ) {
    await this.recommendationService.trackInteraction(
      req.user.id,
      body.productId,
      body.action,
    );
    return { success: true };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('search/semantic')
  async semanticSearch(@Request() req: any, @Query('q') q: string) {
    if (!q) return [];
    const products = await this.prisma.product.findMany({
      where: { status: 'active' },
      take: 50,
      include: {
        category: { select: { name: true } },
        brand: { select: { name: true } },
      },
    });
    return this.aiService.semanticMatch(q, products);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('generate-embedding')
  async generateEmbedding(@Body() body: { text: string }) {
    return this.embeddingsService.generateEmbedding(body.text);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('search/vector')
  async vectorSearch(@Body() body: { text: string; limit?: number }) {
    const embedding = await this.embeddingsService.generateEmbedding(body.text);
    return this.embeddingsService.searchSimilar(
      embedding.vector,
      body.limit || 10,
    );
  }
}
