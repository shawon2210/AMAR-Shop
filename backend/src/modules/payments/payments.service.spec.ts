import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../../common/prisma.service';
import { ConfigService } from '@nestjs/config';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prismaService: PrismaService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: {
            order: { findUnique: jest.fn(), update: jest.fn() },
            paymentTransaction: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock-val'),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prismaService = module.get<PrismaService>(PrismaService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processCodOrder', () => {
    it('should process a COD order successfully (happy path)', async () => {
      const mockOrder = {
        id: 'o-1',
        userId: 'u-1',
        paymentMethod: 'COD',
        status: 'PENDING',
        total: 100,
        user: { name: 'Test', phone: '123' },
      };
      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue(mockOrder as any);
      jest.spyOn(prismaService.order, 'update').mockResolvedValue({ ...mockOrder, status: 'CONFIRMED' } as any);
      
      const result = await service.processCodOrder('o-1', 'u-1');
      expect(result.message).toBe('COD order confirmed');
      expect(prismaService.paymentTransaction.create).toHaveBeenCalled();
    });

    it('should throw if order not found (validation failure)', async () => {
      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue(null);
      await expect(service.processCodOrder('o-1', 'u-1')).rejects.toThrow(BadRequestException);
    });

    it('should throw if order belongs to another user (permission/role failure)', async () => {
      const mockOrder = { id: 'o-1', userId: 'other-user', paymentMethod: 'COD', status: 'PENDING' };
      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue(mockOrder as any);
      
      await expect(service.processCodOrder('o-1', 'u-1')).rejects.toThrow(BadRequestException);
    });

    it('should throw if order status is not PENDING (edge case)', async () => {
      const mockOrder = {
        id: 'o-1',
        userId: 'u-1',
        paymentMethod: 'COD',
        status: 'SHIPPED', // already shipped
      };
      jest.spyOn(prismaService.order, 'findUnique').mockResolvedValue(mockOrder as any);
      
      await expect(service.processCodOrder('o-1', 'u-1')).rejects.toThrow(BadRequestException);
    });
  });
});
