import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from '../../src/modules/cart/cart.service';

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
    },
  };

  beforeEach(async () => {
    prisma = {
      cartItem: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        upsert: jest.fn(),
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
        { provide: 'PrismaService', useValue: prisma },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  describe('getCart', () => {
    it('should return cart items for user', async () => {
      prisma.cartItem.findMany.mockResolvedValue([mockCartItem]);

      const result = await service.getCart('user-1');
      expect(result).toHaveLength(1);
      expect(result[0].product.name).toBe('Smartphone');
    });
  });

  describe('addItem', () => {
    it('should add item to cart', async () => {
      prisma.product.findUnique.mockResolvedValue(mockCartItem.product);
      prisma.cartItem.findFirst.mockResolvedValue(null);
      prisma.cartItem.upsert.mockResolvedValue(mockCartItem);

      const result = await service.addItem('user-1', { productId: 'prod-1', quantity: 1 });
      expect(result).toHaveProperty('id', 'cart-1');
    });

    it('should throw if product is out of stock', async () => {
      prisma.product.findUnique.mockResolvedValue({ ...mockCartItem.product, inStock: false });

      await expect(
        service.addItem('user-1', { productId: 'prod-1', quantity: 1 }),
      ).rejects.toThrow();
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      prisma.cartItem.findUnique.mockResolvedValue(mockCartItem);
      prisma.cartItem.delete.mockResolvedValue(mockCartItem);

      const result = await service.removeItem('cart-1', 'user-1');
      expect(result).toHaveProperty('id', 'cart-1');
    });
  });

  describe('clearCart', () => {
    it('should clear all items for user', async () => {
      prisma.cartItem.deleteMany.mockResolvedValue({ count: 3 });

      const result = await service.clearCart('user-1');
      expect(result.count).toBe(3);
    });
  });
});
