import { Module } from '@nestjs/common';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [CmsController],
  providers: [CmsService, PrismaService],
  exports: [CmsService],
})
export class CmsModule {}
