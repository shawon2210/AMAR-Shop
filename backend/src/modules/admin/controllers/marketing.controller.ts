import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AdminMarketingService } from '../services/marketing.service';
import {
  CreateFlashSaleDto,
  UpdateFlashSaleDto,
  AddCampaignProductDto,
  CreateBannerDto,
  UpdateBannerDto,
  CreateCouponDto,
  UpdateCouponDto,
  CreateCmsPageDto,
  UpdateCmsPageDto,
  CreateAnnouncementDto,
  UpdateAnnouncementDto,
} from '../dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminMarketingController {
  constructor(private readonly marketingService: AdminMarketingService) {}

  @Get('flash-sales')
  async getFlashSales() {
    return this.marketingService.getFlashSales();
  }

  @Post('flash-sales')
  async createFlashSale(@Body() dto: CreateFlashSaleDto) {
    return this.marketingService.createFlashSale(dto);
  }

  @Put('flash-sales/:id')
  async updateFlashSale(
    @Param('id') id: string,
    @Body() dto: UpdateFlashSaleDto,
  ) {
    return this.marketingService.updateFlashSale(id, dto);
  }

  @Delete('flash-sales/:id')
  async deleteFlashSale(@Param('id') id: string) {
    return this.marketingService.deleteFlashSale(id);
  }

  @Post('flash-sales/:id/products')
  async addCampaignProduct(
    @Param('id') id: string,
    @Body() dto: AddCampaignProductDto,
  ) {
    return this.marketingService.addCampaignProduct(id, dto);
  }

  @Get('banners')
  async getBanners() {
    return this.marketingService.getBanners();
  }

  @Post('banners')
  async createBanner(@Body() dto: CreateBannerDto) {
    return this.marketingService.createBanner(dto);
  }

  @Put('banners/:id')
  async updateBanner(@Param('id') id: string, @Body() dto: UpdateBannerDto) {
    return this.marketingService.updateBanner(id, dto);
  }

  @Delete('banners/:id')
  async deleteBanner(@Param('id') id: string) {
    return this.marketingService.deleteBanner(id);
  }

  @Get('coupons')
  async getCoupons(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.marketingService.getCoupons({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    });
  }

  @Post('coupons')
  async createCoupon(@Body() dto: CreateCouponDto) {
    return this.marketingService.createCoupon(dto);
  }

  @Put('coupons/:id')
  async updateCoupon(@Param('id') id: string, @Body() dto: UpdateCouponDto) {
    return this.marketingService.updateCoupon(id, dto);
  }

  @Delete('coupons/:id')
  async deleteCoupon(@Param('id') id: string) {
    return this.marketingService.deleteCoupon(id);
  }

  @Get('cms/pages')
  async getCMSPages() {
    return this.marketingService.getCMSPages();
  }

  @Post('cms/pages')
  async createCMSPage(@Body() dto: CreateCmsPageDto) {
    return this.marketingService.createCMSPage(dto);
  }

  @Put('cms/pages/:id')
  async updateCMSPage(@Param('id') id: string, @Body() dto: UpdateCmsPageDto) {
    return this.marketingService.updateCMSPage(id, dto);
  }

  @Delete('cms/pages/:id')
  async deleteCMSPage(@Param('id') id: string) {
    return this.marketingService.deleteCMSPage(id);
  }

  @Get('cms/announcements')
  async getAnnouncements() {
    return this.marketingService.getAnnouncements();
  }

  @Post('cms/announcements')
  async createAnnouncement(@Body() dto: CreateAnnouncementDto) {
    return this.marketingService.createAnnouncement(dto);
  }

  @Put('cms/announcements/:id')
  async updateAnnouncement(
    @Param('id') id: string,
    @Body() dto: UpdateAnnouncementDto,
  ) {
    return this.marketingService.updateAnnouncement(id, dto);
  }

  @Delete('cms/announcements/:id')
  async deleteAnnouncement(@Param('id') id: string) {
    return this.marketingService.deleteAnnouncement(id);
  }
}
