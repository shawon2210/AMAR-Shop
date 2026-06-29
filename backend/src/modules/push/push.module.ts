import { Module } from '@nestjs/common';
import { PushNotificationService } from './push-notification-service';
import { PrismaService } from '../../common/prisma.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [PushNotificationService, PrismaService],
  exports: [PushNotificationService],
})
export class PushModule {}
