import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('flashSale') flashSale?: string,
    @Query('sort') sort?: string,
  ) {
    return this.productsService.findAll({
      skip: skip ? parseInt(skip) : 0,
      take: take ? parseInt(take) : 20,
      category,
      search,
      flashSale: flashSale === 'true',
      sort,
    });
  }

  @Get('flash-sales')
  async getFlashSales() {
    return this.productsService.getFlashSales();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Get(':id/related')
  async getRelated(@Param('id') id: string, @Query('take') take?: string) {
    return this.productsService.getRelated(id, take ? parseInt(take) : 6);
  }
}
