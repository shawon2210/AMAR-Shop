import { Module } from '@nestjs/common';
import { LogisticsController } from './logistics.controller';
import { LogisticsService } from './logistics.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [LogisticsController],
  providers: [LogisticsService, PrismaService],
  exports: [LogisticsService],
})
export class LogisticsModule {}
