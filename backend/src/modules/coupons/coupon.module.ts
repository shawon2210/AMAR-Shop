import { Module } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  imports: [],
  providers: [PrismaService, CouponService],
  exports: [CouponService],
})
export class CouponsModule {}
