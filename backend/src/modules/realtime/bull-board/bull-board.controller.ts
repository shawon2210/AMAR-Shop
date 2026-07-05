import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { BullQueueService } from '../bull-queue.service';

@Controller('admin/queues')
export class BullBoardController {
  constructor(private readonly bullQueueService: BullQueueService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get()
  async getQueueMetrics() {
    return this.bullQueueService.getQueueMetrics();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('jobs')
  async getRecentJobs() {
    const queues = [
      'order-processing',
      'notification',
      'email',
      'inventory-sync',
      'search-index',
      'analytics',
      'payout',
    ];

    const results: Record<string, unknown> = {};
    for (const name of queues) {
      const queue =
        (this.bullQueueService as any)[`${name.replace('-', '')}Queue`] ||
        (this.bullQueueService as any)[`${name}Queue`];
      if (queue) {
        const [waiting, active, completed, failed] = await Promise.all([
          queue.getJobs(['waiting'], 0, 10),
          queue.getJobs(['active'], 0, 10),
          queue.getJobs(['completed'], 0, 10),
          queue.getJobs(['failed'], 0, 10),
        ]);
        results[name] = { waiting, active, completed, failed };
      }
    }
    return results;
  }
}
