import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CartService } from './cart.service';

@UseGuards(AuthGuard('jwt'))
@Controller('api/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@Request() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('add')
  async addItem(
    @Request() req: any,
    @Body() body: { productId: string; quantity?: number },
  ) {
    return this.cartService.addItem(req.user.id, body.productId, body.quantity);
  }

  @Put(':productId/quantity')
  async updateQuantity(
    @Request() req: any,
    @Param('productId') productId: string,
    @Body() body: { quantity: number },
  ) {
    return this.cartService.updateQuantity(
      req.user.id,
      productId,
      body.quantity,
    );
  }

  @Put(':productId/toggle')
  async toggleSelect(
    @Request() req: any,
    @Param('productId') productId: string,
  ) {
    return this.cartService.toggleSelect(req.user.id, productId);
  }

  @Delete(':productId')
  async removeItem(@Request() req: any, @Param('productId') productId: string) {
    return this.cartService.removeItem(req.user.id, productId);
  }

  @Delete()
  async clearCart(@Request() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}
