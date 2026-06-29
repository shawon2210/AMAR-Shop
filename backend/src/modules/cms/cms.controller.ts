import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CmsService } from './cms.service';

@Controller('api/cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('pages')
  async getPages() {
    return this.cmsService.getPages();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('pages')
  async createPage(@Body() body: any) {
    return this.cmsService.createPage(body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('pages/:id')
  async updatePage(@Param('id') id: string, @Body() body: any) {
    return this.cmsService.updatePage(id, body);
  }

  @Get('banners')
  async getBanners(@Query('position') position?: string) {
    return this.cmsService.getBanners(position);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('banners')
  async createBanner(@Body() body: any) {
    return this.cmsService.createBanner(body);
  }

  @Get('announcements')
  async getAnnouncements() {
    return this.cmsService.getAnnouncements();
  }
}
