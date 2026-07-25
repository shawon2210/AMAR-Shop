import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { AIService } from './ai.service';
import { RecommendationService } from './recommendation.service';
import { EmbeddingsService } from './embeddings.service';
import { PrismaService } from '../../common/prisma.service';
import type { ProductDescriptionRequest } from './interfaces/ai.interface';

@Controller('ai')
export class AIController {
  constructor(
    private readonly aiService: AIService,
    private readonly recommendationService: RecommendationService,
    private readonly embeddingsService: EmbeddingsService,
    private readonly prisma: PrismaService,
  ) {}

  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SELLER', 'ADMIN', 'SUPER_ADMIN')
  @Post('describe-product')
  async describeProduct(@Body() body: ProductDescriptionRequest) {
    return {
      description: await this.aiService.generateProductDescription(body),
    };
  }

  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @UseGuards(AuthGuard('jwt'))
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

  @Throttle({ default: { ttl: 60000, limit: 20 } })
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

  @Throttle({ default: { ttl: 60000, limit: 20 } })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('MODERATOR', 'ADMIN', 'SUPER_ADMIN')
  @Post('moderate')
  async moderate(@Body() body: { text: string }) {
    return this.aiService.moderateContent(body.text);
  }

  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('SELLER', 'ADMIN', 'SUPER_ADMIN')
  @Post('forecast')
  async forecast(
    @Request() req: any,
    @Body() body: { productId: string; days?: number },
  ) {
    return this.aiService.forecastDemand(
      req.user.id,
      req.user.role,
      body.productId,
      body.days || 30,
    );
  }

  @Throttle({ default: { ttl: 60000, limit: 60 } })
  @UseGuards(AuthGuard('jwt'))
  @Get('recommendations/feed')
  async getFeed(@Request() req: any, @Query('limit') limit?: string) {
    return this.recommendationService.getPersonalizedFeed(
      req.user.id,
      limit ? parseInt(limit) : 20,
    );
  }

  @Throttle({ default: { ttl: 60000, limit: 60 } })
  @UseGuards(AuthGuard('jwt'))
  @Get('recommendations/frequently-bought/:productId')
  async getFrequentlyBought(
    @Param('productId') productId: string,
    @Query('limit') limit?: string,
  ) {
    return this.recommendationService.getFrequentlyBoughtTogether(
      productId,
      limit ? parseInt(limit) : 6,
    );
  }

  @Throttle({ default: { ttl: 60000, limit: 60 } })
  @UseGuards(AuthGuard('jwt'))
  @Get('recommendations/cross-sell/:productId')
  async getCrossSell(
    @Param('productId') productId: string,
    @Query('limit') limit?: string,
  ) {
    return this.recommendationService.getCrossSellItems(
      productId,
      limit ? parseInt(limit) : 6,
    );
  }

  @Throttle({ default: { ttl: 60000, limit: 60 } })
  @UseGuards(AuthGuard('jwt'))
  @Get('recommendations/upsell/:productId')
  async getUpsell(
    @Param('productId') productId: string,
    @Query('limit') limit?: string,
  ) {
    return this.recommendationService.getUpsellItems(
      productId,
      limit ? parseInt(limit) : 6,
    );
  }

  @Throttle({ default: { ttl: 60000, limit: 120 } })
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

  @Throttle({ default: { ttl: 60000, limit: 20 } })
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

  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @UseGuards(AuthGuard('jwt'))
  @Post('generate-embedding')
  async generateEmbedding(@Body() body: { text: string }) {
    return this.embeddingsService.generateEmbedding(body.text);
  }

  @Throttle({ default: { ttl: 60000, limit: 10 } })
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
