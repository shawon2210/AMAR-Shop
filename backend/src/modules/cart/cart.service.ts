import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class CartService {
  constructor(private prismaService: PrismaService) {}

  async getCart(userId: string) {
    const items = await this.prismaService.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          include: {
            category: true,
            store: { select: { id: true, name: true, isOfficial: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group by seller
    const grouped = items.reduce((acc: any[], item) => {
      const storeId = item.product.store.id;
      const existing = acc.find((g) => g.sellerId === storeId);
      if (existing) {
        existing.items.push(item);
      } else {
        acc.push({
          sellerId: storeId,
          sellerName: item.product.store.name,
          isOfficial: item.product.store.isOfficial,
          items: [item],
        });
      }
      return acc;
    }, []);

    return {
      items,
      grouped,
      total: items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      count: items.reduce((sum, i) => sum + i.quantity, 0),
    };
  }

  async addItem(userId: string, productId: string, quantity = 1) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');

    const existing = await this.prismaService.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (existing) {
      return this.prismaService.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    }

    return this.prismaService.cartItem.create({
      data: { userId, productId, quantity, selected: true },
    });
  }

  async updateQuantity(userId: string, productId: string, quantity: number) {
    const item = await this.prismaService.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (!item) throw new NotFoundException('Cart item not found');

    return this.prismaService.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });
  }

  async removeItem(userId: string, productId: string) {
    const item = await this.prismaService.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (!item) throw new NotFoundException('Cart item not found');

    return this.prismaService.cartItem.delete({ where: { id: item.id } });
  }

  async toggleSelect(userId: string, productId: string) {
    const item = await this.prismaService.cartItem.findUnique({
      where: { userId_productId: { userId, productId } },
    });
    if (!item) throw new NotFoundException('Cart item not found');

    return this.prismaService.cartItem.update({
      where: { id: item.id },
      data: { selected: !item.selected },
    });
  }

  async clearCart(userId: string) {
    await this.prismaService.cartItem.deleteMany({ where: { userId } });
    return { message: 'Cart cleared' };
  }
}
