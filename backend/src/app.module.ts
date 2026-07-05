import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { SellerModule } from './modules/seller/seller.module';
import { AdminModule } from './modules/admin/admin.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { LogisticsModule } from './modules/logistics/logistics.module';
import { SupportModule } from './modules/support/support.module';
import { NotificationModule } from './modules/notification/notification.module';
import { SearchModule } from './modules/search/search.module';
import { CmsModule } from './modules/cms/cms.module';
import { RealtimeModule } from './modules/realtime/realtime.module';
import { AIModule } from './modules/ai/ai.module';
import { DeveloperModule } from './modules/developer/developer.module';
import { ComplianceModule } from './modules/compliance/compliance.module';
import { AffiliateModule } from './modules/affiliate/affiliate.module';
import { PushModule } from './modules/push/push.module';
import { WmsModule } from './modules/wms/wms.module';
import { FulfillmentModule } from './modules/fulfillment/fulfillment.module';
import { FinanceModule } from './modules/finance/finance.module';
import { BiModule } from './modules/bi/bi.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  HealthController,
  DependencyChecker,
} from './common/health.controller';
import { PrismaService } from './common/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ProductsModule,
    CategoriesModule,
    AuthModule,
    CartModule,
    OrdersModule,
    PaymentsModule,
    SellerModule,
    AdminModule,
    WalletModule,
    LogisticsModule,
    SupportModule,
    NotificationModule,
    SearchModule,
    CmsModule,
    RealtimeModule,
    AIModule,
    DeveloperModule,
    ComplianceModule,
    AffiliateModule,
    PushModule,
    WmsModule,
    FulfillmentModule,
    FinanceModule,
    BiModule,
    AddressesModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, PrismaService, DependencyChecker],
})
export class AppModule {}
