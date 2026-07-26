import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { LogisticsService } from './logistics.service';

@UseGuards(AuthGuard('jwt'))
@Controller('logistics')
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  @Roles('LOGISTICS', 'ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @Post('shipments')
  async createShipment(@Body() body: { orderId: string; courierId?: string }) {
    return this.logisticsService.createShipment(body.orderId, body.courierId);
  }

  @Get('couriers')
  async getCouriers() {
    return this.logisticsService.getCouriers();
  }

  @Get('zones')
  async getDeliveryZones(@Query('courierId') courierId: string) {
    return this.logisticsService.getDeliveryZones(courierId);
  }

  @Roles('LOGISTICS', 'SELLER', 'ADMIN', 'SUPER_ADMIN')
  @UseGuards(RolesGuard)
  @Post('calculate')
  async calculateShipping(
    @Body() body: { weight: number; district: string; courierId: string },
  ) {
    return this.logisticsService.calculateShipping(
      body.weight,
      body.district,
      body.courierId,
    );
  }

  @Get('track/:trackingId')
  async trackShipment(
    @Param('trackingId') trackingId: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.logisticsService.getShipmentStatus(trackingId, user.id, user.role);
  }
}
