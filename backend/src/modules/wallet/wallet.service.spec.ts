import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { PrismaService } from '../../common/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('WalletService', () => {
  let service: WalletService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: PrismaService,
          useValue: {
            wallet: { upsert: jest.fn(), update: jest.fn() },
            walletTransaction: { create: jest.fn(), findMany: jest.fn(), count: jest.fn() },
            store: { findUnique: jest.fn() },
            sellerProfile: { findUnique: jest.fn() },
            sellerPayout: { create: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
          },
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addFunds', () => {
    it('should add funds successfully (happy path)', async () => {
      const mockWallet = { id: 'w-1', userId: 'u-1', balance: 100, totalEarned: 100 };
      jest.spyOn(prismaService.wallet, 'upsert').mockResolvedValue(mockWallet as any);
      jest.spyOn(prismaService.wallet, 'update').mockResolvedValue({} as any);
      jest.spyOn(prismaService.walletTransaction, 'create').mockResolvedValue({} as any);

      const result = await service.addFunds('u-1', 50, 'BANK');
      expect(result.balance).toBe(150);
      expect(prismaService.wallet.update).toHaveBeenCalled();
    });

    it('should fail if amount is negative (validation failure)', async () => {
      await expect(service.addFunds('u-1', -10, 'BANK')).rejects.toThrow(BadRequestException);
    });
  });

  describe('requestPayout', () => {
    it('should throw NotFoundException if store not found (permission/role failure - not a seller)', async () => {
      jest.spyOn(prismaService.store, 'findUnique').mockResolvedValue(null);
      await expect(service.requestPayout('u-1', 100, 'bank')).rejects.toThrow(NotFoundException);
    });
  });

  describe('deductFunds', () => {
    it('should throw BadRequestException if balance is insufficient (edge case)', async () => {
      const mockWallet = { id: 'w-1', userId: 'u-1', balance: 50 };
      jest.spyOn(prismaService.wallet, 'upsert').mockResolvedValue(mockWallet as any);

      await expect(service.deductFunds('u-1', 100, 'ref-1')).rejects.toThrow(BadRequestException);
    });
  });
});
