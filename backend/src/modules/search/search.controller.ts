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
import { SearchService } from './search.service';
import { EnhancedSearchService } from './enhanced-search.service';
import { SearchAnalyticsService } from './search-analytics.service';

@Controller('search')
export class SearchController {
  constructor(
    private readonly searchService: SearchService,
    private readonly enhancedSearchService: EnhancedSearchService,
    private readonly searchAnalyticsService: SearchAnalyticsService,
  ) {}

  @Get()
  async search(
    @Query('q') q: string,
    @Query('category') category?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('rating') rating?: string,
    @Query('brand') brand?: string,
    @Query('seller') seller?: string,
    @Query('inStock') inStock?: string,
    @Query('sort') sort?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('mode') mode?: 'text' | 'vector' | 'hybrid' | 'personalized',
    @Request() req?: any,
  ) {
    const filters = {
      category,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      rating: rating ? parseFloat(rating) : undefined,
      brand,
      seller,
      inStock:
        inStock === 'true' ? true : inStock === 'false' ? false : undefined,
      sort,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    };

    let results;
    switch (mode) {
      case 'vector':
        results = await this.enhancedSearchService.vectorSearch(
          q || '',
          filters,
        );
        break;
      case 'hybrid':
        results = await this.enhancedSearchService.hybridSearch(
          q || '',
          filters,
        );
        break;
      case 'personalized':
        results = await this.enhancedSearchService.personalizedSearch(
          req?.user?.id,
          q || '',
          filters,
        );
        break;
      default:
        results = await this.searchService.search(q || '', filters);
    }

    await this.searchService.logSearch(
      req?.user?.id,
      q || '',
      results.total || 0,
    );
    return results;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('personalized')
  async getPersonalizedFeed(
    @Request() req: any,
    @Query('limit') limit?: string,
  ) {
    return this.enhancedSearchService.personalizedSearch(req.user.id, '', {
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get('autocomplete')
  async autocomplete(@Query('q') q: string) {
    return this.searchService.autocomplete(q || '');
  }

  @Get('autocomplete/ai')
  async autocompleteAI(@Query('q') q: string) {
    return this.enhancedSearchService.autoCompleteWithAI(q || '');
  }

  @Get('suggestions')
  async getSuggestions(@Query('q') q: string) {
    return this.searchService.getSuggestions(q || '');
  }

  @Get('popular')
  async getPopularSearches(
    @Query('limit') limit?: string,
    @Query('timeframe') timeframe?: string,
  ) {
    if (timeframe) {
      return this.searchAnalyticsService.getPopularSearches(
        timeframe as any,
        limit ? parseInt(limit) : 10,
      );
    }
    return this.searchService.getPopularSearches(limit ? parseInt(limit) : 10);
  }

  @Get('trending')
  async getTrendingProducts(@Query('limit') limit?: string) {
    return this.searchService.getTrendingProducts(limit ? parseInt(limit) : 20);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('recently-viewed')
  async getRecentlyViewed(@Request() req: any, @Query('limit') limit?: string) {
    return this.searchService.getRecentlyViewed(
      req.user.id,
      limit ? parseInt(limit) : 20,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('log')
  async logSearch(
    @Request() req: any,
    @Body() body: { query: string; resultsCount: number },
  ) {
    return this.searchAnalyticsService.logSearch(
      body.query,
      req.user.id,
      body.resultsCount,
    );
  }

  @Get('filters')
  async getFacetedFilters(@Query('categoryId') categoryId?: string) {
    return this.searchService.getFacetedFilters(categoryId);
  }

  @Get('intent')
  async getSearchIntent(@Query('q') q: string) {
    return this.enhancedSearchService.getSearchIntents(q || '');
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('ltr-signal')
  collectLtrSignal(@Body() body: any) {
    this.enhancedSearchService.collectLtrSignal(body);
    return { success: true };
  }

  @Get('analytics/zero-results')
  async getZeroResultSearches(@Query('limit') limit?: string) {
    return this.searchAnalyticsService.getZeroResultSearches(
      limit ? parseInt(limit) : 50,
    );
  }

  @Get('analytics/conversion-rate')
  async getSearchConversionRate() {
    return this.searchAnalyticsService.getSearchConversionRate();
  }

  @Get('analytics/top-categories')
  async getTopSearchCategories(@Query('limit') limit?: string) {
    return this.searchAnalyticsService.getTopSearchCategories(
      limit ? parseInt(limit) : 10,
    );
  }

  @Get('analytics/trends')
  async getSearchTrends(@Query('days') days?: string) {
    return this.searchAnalyticsService.getSearchTrends(
      days ? parseInt(days) : 30,
    );
  }

  @Get('analytics/heatmap')
  async getSearchHeatmap(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.enhancedSearchService.getSearchHeatmapData({ start, end });
  }
}
