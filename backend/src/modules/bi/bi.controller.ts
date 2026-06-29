import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BiService } from './bi.service';

@UseGuards(AuthGuard('jwt'))
@Controller('api/bi')
export class BiController {
  constructor(private readonly bi: BiService) {}

  @Get('executive-dashboard')
  async getExecutiveDashboard(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.bi.getExecutiveDashboard({ start, end });
  }

  @Get('rfm')
  async getRFM() {
    return this.bi.getRFMAnalysis();
  }

  @Get('clv')
  async getCLV() {
    return this.bi.getCustomerLifetimeValue();
  }

  @Get('cohorts')
  async getCohorts(@Query('period') period?: string) {
    return this.bi.getCohortAnalysis(period);
  }

  @Get('retention')
  async getRetention(@Query('start') start: string, @Query('end') end: string) {
    return this.bi.getRetentionReport({ start, end });
  }

  @Get('seller-performance')
  async getSellerPerformance(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.bi.getSellerPerformance({ start, end });
  }

  @Get('product-profitability')
  async getProductProfitability(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.bi.getProductProfitability({ start, end });
  }

  @Get('campaign-roi/:campaignId')
  async getCampaignROI(@Param('campaignId') campaignId: string) {
    return this.bi.getCampaignROI(campaignId);
  }

  @Get('attribution')
  async getAttribution(
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    return this.bi.getMarketingAttribution({
      start: start || new Date().toISOString().split('T')[0],
      end: end || new Date().toISOString().split('T')[0],
    });
  }

  @Get('funnels')
  async getFunnels(
    @Query('startEvent') startEvent?: string,
    @Query('endEvent') endEvent?: string,
  ) {
    return this.bi.getUserFunnels(
      startEvent || 'VIEW_PRODUCT',
      endEvent || 'PURCHASE',
    );
  }

  @Get('sessions')
  async getSessions(@Query('start') start: string, @Query('end') end: string) {
    return this.bi.getSessionAnalytics({ start, end });
  }

  @Get('operations')
  async getOperations(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.bi.getOperationalMetrics({ start, end });
  }

  @Get('forecast')
  async getForecast(
    @Query('metric') metric?: string,
    @Query('months') months?: string,
  ) {
    return this.bi.getForecastModels(
      metric || 'revenue',
      parseInt(months ?? '6'),
    );
  }

  @Post('custom-reports')
  async createCustomReport(
    @Body()
    body: {
      name: string;
      metrics: string[];
      dateRange: { start: string; end: string };
      groupBy?: string;
    },
  ) {
    return this.bi.generateCustomReport(body);
  }

  @Post('schedule-report')
  async scheduleReport(
    @Body()
    body: {
      name: string;
      type: string;
      config: any;
      cron: string;
      recipients: string[];
      format?: string;
    },
  ) {
    return this.bi.createScheduledReport(body);
  }

  @Get('reports')
  async listReports() {
    return this.bi.listScheduledReports();
  }

  @Get('reports/:id/export/pdf')
  async exportPdf(@Param('id') id: string) {
    return this.bi.exportToPdf(id);
  }

  @Get('reports/:id/export/excel')
  async exportExcel(@Param('id') id: string) {
    return this.bi.exportToExcel(id);
  }

  @Get('data-sources')
  async getDataSources() {
    return this.bi.getDataSources();
  }

  @Get('rfm-segments')
  async getRfmSegments() {
    return this.bi.getRfmSegments();
  }

  @Get('cohort-data')
  async getCohortData() {
    return this.bi.getCohortData();
  }
}
