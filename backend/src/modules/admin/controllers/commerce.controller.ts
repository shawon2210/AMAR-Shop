import {
  Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AdminCommerceService } from '../services/commerce.service';
import {
  CreateProductDto, UpdateProductDto, UpdateOrderStatusDto, AddOrderNoteDto,
  CreateCategoryDto, UpdateCategoryDto,
} from '../dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminCommerceController {
  constructor(private readonly commerceService: AdminCommerceService) {}

  @Get('products')
  async getProducts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.commerceService.getProducts({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status, search, category,
    });
  }

  @Post('products')
  async createProduct(@Body() dto: CreateProductDto) {
    return this.commerceService.createProduct(dto);
  }

  @Put('products/:id')
  async updateProduct(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.commerceService.updateProduct(id, dto);
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string) {
    return this.commerceService.deleteProduct(id);
  }

  @Post('products/:id/approve')
  async approveProduct(@Param('id') id: string) {
    return this.commerceService.approveProduct(id);
  }

  @Post('products/:id/reject')
  async rejectProduct(@Param('id') id: string, @Body('reason') reason: string) {
    return this.commerceService.rejectProduct(id, reason);
  }

  @Get('orders')
  async getOrders(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.commerceService.getOrders({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status, from, to,
    });
  }

  @Put('orders/:id/status')
  async updateOrderStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.commerceService.updateOrderStatus(id, dto.status);
  }

  @Post('orders/:id/notes')
  async addOrderNote(@Param('id') id: string, @Body() dto: AddOrderNoteDto) {
    return this.commerceService.addOrderNote(id, dto.note);
  }

  @Get('categories')
  async getCategories() {
    return this.commerceService.getCategories();
  }

  @Post('categories')
  async createCategory(@Body() dto: CreateCategoryDto) {
    return this.commerceService.createCategory(dto);
  }

  @Put('categories/:id')
  async updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.commerceService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.commerceService.deleteCategory(id);
  }

  @Get('payments')
  async getPayments(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.commerceService.getPayments({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status, from, to,
    });
  }
}
