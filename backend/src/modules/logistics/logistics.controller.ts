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
import { LogisticsService } from './logistics.service';

@UseGuards(AuthGuard('jwt'))
@Controller('api/logistics')
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

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
  async trackShipment(@Param('trackingId') trackingId: string) {
    return this.logisticsService.getShipmentStatus(trackingId);
  }
}
