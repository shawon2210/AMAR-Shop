import { Controller, Get, Post, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AdminSellerService } from '../services/seller.service';
import { UpdateSellerDto } from '../dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminSellerController {
  constructor(private readonly sellerService: AdminSellerService) {}

  @Get('sellers')
  async getSellers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('kycStatus') kycStatus?: string,
  ) {
    return this.sellerService.getSellers({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      search,
      kycStatus,
    });
  }

  @Put('sellers/:id')
  async updateSeller(@Param('id') id: string, @Body() dto: UpdateSellerDto) {
    return this.sellerService.updateSeller(id, dto);
  }

  @Put('sellers/:id/store-status')
  async toggleStoreStatus(@Param('id') id: string) {
    return this.sellerService.toggleStoreStatus(id);
  }

  @Post('sellers/:id/approve')
  async approveSeller(@Param('id') id: string) {
    return this.sellerService.approveSeller(id);
  }

  @Post('sellers/:id/reject')
  async rejectSeller(@Param('id') id: string, @Body('reason') reason: string) {
    return this.sellerService.rejectSeller(id, reason);
  }
}
