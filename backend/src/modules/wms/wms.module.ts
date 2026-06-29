import { Module } from '@nestjs/common';
import { WmsController } from './wms.controller';
import { WmsService } from './wms.service';
import { BarcodeService } from './barcode.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [WmsController],
  providers: [WmsService, BarcodeService, PrismaService],
  exports: [WmsService, BarcodeService],
})
export class WmsModule {}
