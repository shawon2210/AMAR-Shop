import { Module, forwardRef } from '@nestjs/common';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';
import { PrismaService } from '../../common/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [SellerController],
  providers: [SellerService, PrismaService],
  exports: [SellerService],
})
export class SellerModule {}
