import { Module } from '@nestjs/common';
import { DeveloperController } from './developer.controller';
import { DeveloperService } from './developer.service';
import { PrismaService } from '../../common/prisma.service';

@Module({
  controllers: [DeveloperController],
  providers: [DeveloperService, PrismaService],
  exports: [DeveloperService],
})
export class DeveloperModule {}
