import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../../common/prisma.service';
import { CouponService } from '../coupons/coupon.service';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let prismaService: PrismaService;
  let couponService: CouponService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: {
            address: { findUnique: jest.fn() },
            product: { findMany: jest.fn(), update: jest.fn() },
            order: { findMany: jest.fn(), count: jest.fn(), create: jest.fn() },
            cartItem: { deleteMany: jest.fn() },
            $transaction: jest.fn(),
          },
        },
        {
          provide: CouponService,
          useValue: {
            validateCoupon: jest.fn(),
            applyCoupon: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prismaService = module.get<PrismaService>(PrismaService);
    couponService = module.get<CouponService>(CouponService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an order successfully (happy path)', async () => {
      const userId = 'user-1';
      const addressId = 'address-1';
      const mockAddress = { id: addressId, userId };
      const mockProducts = [
        { id: 'p-1', price: 100, stockCount: 10, inStock: true, storeId: 's-1' },
      ];
      
      jest.spyOn(prismaService.address, 'findUnique').mockResolvedValue(mockAddress as any);
      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue(mockProducts as any);
      
      const mockOrder = { id: 'order-1' };
      jest.spyOn(prismaService, '$transaction').mockImplementation(async (cb) => {
        return cb(prismaService);
      });
      jest.spyOn(prismaService.order, 'create').mockResolvedValue(mockOrder as any);

      const result = await service.create(userId, {
        addressId,
        paymentMethod: 'COD',
        items: [{ productId: 'p-1', quantity: 2 }],
      });

      expect(result).toBe(mockOrder);
      expect(prismaService.address.findUnique).toHaveBeenCalledWith({ where: { id: addressId } });
      expect(prismaService.product.findMany).toHaveBeenCalled();
    });

    it('should fail if no items are provided (validation failure)', async () => {
      await expect(
        service.create('user-1', {
          addressId: 'addr-1',
          paymentMethod: 'COD',
          items: [],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should fail if address belongs to another user (permission/role failure)', async () => {
      jest.spyOn(prismaService.address, 'findUnique').mockResolvedValue({
        id: 'addr-1',
        userId: 'other-user',
      } as any);

      await expect(
        service.create('user-1', {
          addressId: 'addr-1',
          paymentMethod: 'COD',
          items: [{ productId: 'p-1', quantity: 1 }],
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should fail if product has insufficient stock (edge case)', async () => {
      const userId = 'user-1';
      const addressId = 'address-1';
      jest.spyOn(prismaService.address, 'findUnique').mockResolvedValue({ id: addressId, userId } as any);
      
      // Stock is only 1
      jest.spyOn(prismaService.product, 'findMany').mockResolvedValue([
        { id: 'p-1', price: 100, stockCount: 1, inStock: true, storeId: 's-1' },
      ] as any);

      await expect(
        service.create(userId, {
          addressId,
          paymentMethod: 'COD',
          items: [{ productId: 'p-1', quantity: 2 }],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
