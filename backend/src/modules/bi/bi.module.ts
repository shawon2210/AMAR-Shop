import { Module } from '@nestjs/common';
import { BiController } from './bi.controller';
import { BiService } from './bi.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [BiController],
  providers: [BiService, PrismaService],
  exports: [BiService],
})
export class BiModule {}
