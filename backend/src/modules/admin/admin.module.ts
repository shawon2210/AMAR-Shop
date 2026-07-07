import { Module, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { RolesGuard } from '../../common/guards/roles.guard';
import {
  AdminDashboardController,
  AdminUserController,
  AdminSellerController,
  AdminCommerceController,
  AdminMarketingController,
  AdminSupportController,
  AdminFinanceController,
} from './controllers';
import {
  AdminDashboardService,
  AdminUserService,
  AdminSellerService,
  AdminCommerceService,
  AdminMarketingService,
  AdminSupportService,
  AdminFinanceService,
} from './services';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [
    AdminDashboardController,
    AdminUserController,
    AdminSellerController,
    AdminCommerceController,
    AdminMarketingController,
    AdminSupportController,
    AdminFinanceController,
  ],
  providers: [
    PrismaService,
    RolesGuard,
    AdminDashboardService,
    AdminUserService,
    AdminSellerService,
    AdminCommerceService,
    AdminMarketingService,
    AdminSupportService,
    AdminFinanceService,
  ],
})
export class AdminModule {}
