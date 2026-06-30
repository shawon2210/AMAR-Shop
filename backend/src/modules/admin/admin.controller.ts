import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';

@UseGuards(AuthGuard('jwt'))
@Controller('api/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('users')
  async getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.getUsers({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      search,
      role,
    });
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateUser(id, body);
  }

  @Get('sellers')
  async getSellers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('kycStatus') kycStatus?: string,
  ) {
    return this.adminService.getSellers({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      search,
      kycStatus,
    });
  }

  @Post('sellers/:id/approve')
  async approveSeller(@Param('id') id: string) {
    return this.adminService.approveSeller(id);
  }

  @Post('sellers/:id/reject')
  async rejectSeller(@Param('id') id: string, @Body('reason') reason: string) {
    return this.adminService.rejectSeller(id, reason);
  }

  @Get('products')
  async getProducts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.adminService.getProducts({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
      search,
      category,
    });
  }

  @Post('products/:id/approve')
  async approveProduct(@Param('id') id: string) {
    return this.adminService.approveProduct(id);
  }

  @Post('products/:id/reject')
  async rejectProduct(@Param('id') id: string, @Body('reason') reason: string) {
    return this.adminService.rejectProduct(id, reason);
  }

  @Get('orders')
  async getOrders(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.adminService.getOrders({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
      from,
      to,
    });
  }

  @Get('payments')
  async getPayments(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.adminService.getPayments({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
      from,
      to,
    });
  }

  @Get('flash-sales')
  async getFlashSales() {
    return this.adminService.getFlashSales();
  }

  @Post('flash-sales')
  async createFlashSale(@Body() body: any) {
    return this.adminService.createFlashSale(body);
  }

  @Get('categories')
  async getCategories() {
    return this.adminService.getCategories();
  }

  @Post('categories')
  async createCategory(@Body() body: any) {
    return this.adminService.createCategory(body);
  }

  @Get('banners')
  async getBanners() {
    return this.adminService.getBanners();
  }

  @Post('banners')
  async createBanner(@Body() body: any) {
    return this.adminService.createBanner(body);
  }

  @Get('coupons')
  async getCoupons(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.adminService.getCoupons({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    });
  }

  @Post('coupons')
  async createCoupon(@Body() body: any) {
    return this.adminService.createCoupon(body);
  }

  @Get('analytics')
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Get('reports/:type')
  async getReports(
    @Param('type') type: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.adminService.getReports(type, { from, to });
  }

  @Put('settings')
  async updateSettings(@Body() body: any) {
    return this.adminService.updateSettings(body);
  }

  @Get('support-tickets')
  async getSupportTickets(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.adminService.getSupportTickets({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
      priority,
    });
  }
}
