import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from '../../src/modules/products/products.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: any;

  const mockProducts = [
    {
      id: 'prod-1',
      name: 'Smartphone',
      slug: 'smartphone',
      price: 25000,
      originalPrice: 30000,
      images: ['https://example.com/img.jpg'],
      rating: 4.5,
      reviewCount: 128,
      inStock: true,
      stockCount: 50,
      soldCount: 320,
      category: { id: 'cat-1', name: 'Electronics' },
      store: { id: 'store-1', name: 'Tech Store' },
    },
  ];

  beforeEach(async () => {
    prisma = {
      product: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      category: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: 'PrismaService', useValue: prisma },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      prisma.product.findMany.mockResolvedValue(mockProducts);
      prisma.product.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 20 });
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by category', async () => {
      prisma.product.findMany.mockResolvedValue(mockProducts);
      prisma.product.count.mockResolvedValue(1);

      await service.findAll({ page: 1, limit: 20, categoryId: 'cat-1' });
      expect(prisma.product.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ categoryId: 'cat-1' }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      prisma.product.findUnique.mockResolvedValue(mockProducts[0]);

      const result = await service.findOne('prod-1');
      expect(result).toHaveProperty('id', 'prod-1');
    });

    it('should throw on non-existent product', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow();
    });
  });
});
