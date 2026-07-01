import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SellerService } from './seller.service';

@UseGuards(AuthGuard('jwt'))
@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get('dashboard')
  async getDashboard(@Request() req: any) {
    return this.sellerService.getDashboard(req.user.id);
  }

  @Get('products')
  async getProducts(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.sellerService.getProducts(req.user.id, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
      search,
      category,
    });
  }

  @Post('products')
  async createProduct(@Request() req: any, @Body() body: any) {
    return this.sellerService.createProduct(req.user.id, body);
  }

  @Put('products/:id')
  async updateProduct(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.sellerService.updateProduct(id, req.user.id, body);
  }

  @Delete('products/:id')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Request() req: any, @Param('id') id: string) {
    return this.sellerService.deleteProduct(id, req.user.id);
  }

  @Get('orders')
  async getOrders(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    return this.sellerService.getOrders(req.user.id, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
      search,
    });
  }

  @Put('orders/:id/status')
  async updateOrderStatus(
    @Request() req: any,
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.sellerService.updateOrderStatus(id, req.user.id, status);
  }

  @Get('inventory')
  async getInventory(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('lowStock') lowStock?: string,
  ) {
    return this.sellerService.getInventory(req.user.id, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      lowStock: lowStock === 'true',
    });
  }

  @Get('analytics')
  async getAnalytics(
    @Request() req: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.sellerService.getAnalytics(req.user.id, { from, to });
  }

  @Get('finance')
  async getFinance(@Request() req: any) {
    return this.sellerService.getFinance(req.user.id);
  }

  @Get('store')
  async getStore(@Request() req: any) {
    return this.sellerService.getStoreProfile(req.user.id);
  }

  @Put('store')
  async updateStore(@Request() req: any, @Body() body: any) {
    return this.sellerService.updateStore(req.user.id, body);
  }

  @Get('kyc')
  async getKycStatus(@Request() req: any) {
    return this.sellerService.getKycStatus(req.user.id);
  }
}
