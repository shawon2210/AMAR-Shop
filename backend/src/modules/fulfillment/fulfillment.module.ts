import { Module } from '@nestjs/common';
import { FulfillmentController } from './fulfillment.controller';
import { FulfillmentService } from './fulfillment.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [FulfillmentController],
  providers: [FulfillmentService, PrismaService],
  exports: [FulfillmentService],
})
export class FulfillmentModule {}
