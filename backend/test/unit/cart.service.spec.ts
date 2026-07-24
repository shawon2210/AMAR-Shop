import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../../src/modules/cart/cart.service';
import { PrismaService } from '../../src/common/prisma.service';

describe('CartService', () => {
  let service: CartService;
  let prisma: any;

  const mockCartItem = {
    id: 'cart-1',
    quantity: 2,
    selected: true,
    userId: 'user-1',
    productId: 'prod-1',
    product: {
      id: 'prod-1',
      name: 'Smartphone',
      price: 25000,
      images: ['img.jpg'],
      inStock: true,
      stockCount: 10,
      store: {
        id: 'store-1',
        name: 'Tech Store',
        isOfficial: true,
      },
    },
  };

  beforeEach(async () => {
    prisma = {
      cartItem: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        upsert: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        deleteMany: jest.fn(),
      },
      product: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  describe('getCart', () => {
    it('should return cart items for user grouped by seller', async () => {
      prisma.cartItem.findMany.mockResolvedValue([mockCartItem]);

      const result = await service.getCart('user-1');
      expect(result.grouped).toHaveLength(1);
      expect(result.grouped[0].sellerId).toBe('store-1');
      expect(result.grouped[0].items[0].product.name).toBe('Smartphone');
    });
  });

  describe('addItem', () => {
    it('should add item to cart', async () => {
      prisma.product.findUnique.mockResolvedValue(mockCartItem.product);
      prisma.cartItem.findUnique.mockResolvedValue(null);
      prisma.cartItem.create.mockResolvedValue(mockCartItem);

      const result = await service.addItem('user-1', 'prod-1', 1);
      expect(result).toHaveProperty('id', 'cart-1');
    });

    it('should throw if product is out of stock', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(
        service.addItem('user-1', 'prod-1', 1),
      ).rejects.toThrow();
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      prisma.cartItem.findUnique.mockResolvedValue(mockCartItem);
      prisma.cartItem.delete.mockResolvedValue(mockCartItem);

      const result = await service.removeItem('user-1', 'prod-1');
      expect(result).toHaveProperty('id', 'cart-1');
    });
  });

  describe('clearCart', () => {
    it('should clear all items for user', async () => {
      prisma.cartItem.deleteMany.mockResolvedValue({ count: 3 });

      const result = await service.clearCart('user-1');
      expect(result).toEqual({ message: 'Cart cleared' });
    });
  });
});
