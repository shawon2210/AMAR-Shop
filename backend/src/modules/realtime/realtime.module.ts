import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RealtimeGateway } from './realtime.gateway';
import { RealtimeService } from './realtime.service';
import { BullQueueService } from './bull-queue.service';
import { EventBusService } from './event-bus.service';
import { PrismaService } from '../../common/prisma.service';
import { realtimeConfig } from './realtime.config';
import { BullBoardController } from './bull-board/bull-board.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: realtimeConfig.jwtSecret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [BullBoardController],
  providers: [
    RealtimeGateway,
    RealtimeService,
    BullQueueService,
    EventBusService,
    PrismaService,
  ],
  exports: [RealtimeService, BullQueueService, EventBusService],
})
export class RealtimeModule {}
