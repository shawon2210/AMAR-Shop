import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DeveloperService } from './developer.service';

@Controller('developer')
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('api-keys')
  async createApiKey(
    @Body() body: { name: string; permissions: string[] },
    @Request() req: any,
  ) {
    return this.developerService.createApiKey(
      body.name,
      req.user.id,
      body.permissions || [],
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api-keys')
  async getApiKeys(@Request() req: any) {
    return this.developerService.getApiKeys(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('api-keys/:id')
  async revokeApiKey(@Param('id') id: string, @Request() req: any) {
    return this.developerService.revokeApiKey(id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api-keys/:id/usage')
  async getUsage(
    @Param('id') id: string,
    @Request() req: any,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    const dateRange =
      start && end ? { start: new Date(start), end: new Date(end) } : undefined;
    return this.developerService.getUsageStats(id, req.user.id, dateRange);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('webhooks')
  async registerWebhook(
    @Request() req: any,
    @Body()
    body: {
      storeId: string;
      event: string;
      url: string;
      secret: string;
    },
  ) {
    return this.developerService.registerWebhook(
      body.storeId,
      body.event,
      body.url,
      body.secret,
      req.user.id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('webhooks')
  async getWebhooks(@Request() req: any, @Query('storeId') storeId: string) {
    return this.developerService.getWebhooks(storeId, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('webhooks/:id')
  async deleteWebhook(@Param('id') id: string, @Request() req: any) {
    return this.developerService.deleteWebhook(id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('webhooks/:id/logs')
  async getWebhookLogs(@Param('id') id: string, @Request() req: any) {
    return this.developerService.getWebhookLogs(id, req.user.id);
  }
}
