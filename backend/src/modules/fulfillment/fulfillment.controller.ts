import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { FulfillmentService } from './fulfillment.service';

@UseGuards(AuthGuard('jwt'))
@Controller('fulfillment')
export class FulfillmentController {
  constructor(private readonly fulfillment: FulfillmentService) {}

  @UseGuards(RolesGuard)
  @Roles('LOGISTICS', 'ADMIN', 'SUPER_ADMIN')
  @Post('assign')
  async assign(@Body() body: { orderId: string }) {
    return this.fulfillment.assignWarehouse(body.orderId);
  }

  @UseGuards(RolesGuard)
  @Roles('LOGISTICS', 'ADMIN', 'SUPER_ADMIN')
  @Post('shipments')
  async createShipment(@Body() body: { orderId: string }) {
    return this.fulfillment.createShipment(body.orderId);
  }

  @Get('delivery-slots')
  async getDeliverySlots(@Query('pincode') pincode: string) {
    return this.fulfillment.getDeliverySlots(pincode);
  }

  @UseGuards(RolesGuard)
  @Roles('LOGISTICS', 'ADMIN', 'SUPER_ADMIN')
  @Put('pickup')
  async schedulePickup(
    @Body()
    body: {
      shipmentId: string;
      slot: { date: string; timeSlot: string };
    },
  ) {
    return this.fulfillment.schedulePickup(body.shipmentId, body.slot);
  }

  @Get('sla')
  async calculateSLA(
    @Query('fromWarehouse') fromWarehouse: string,
    @Query('toAddress') toAddress: string,
  ) {
    return this.fulfillment.calculateSLA(fromWarehouse, toAddress);
  }

  @Get('options')
  async getOptions(@Query('sellerId') sellerId: string) {
    return this.fulfillment.getFulfillmentOptions(sellerId);
  }

  @UseGuards(RolesGuard)
  @Roles('LOGISTICS', 'ADMIN', 'SUPER_ADMIN')
  @Get('courier-performance')
  async getCourierPerformance(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.fulfillment.getCourierPerformance({ start, end });
  }

  @Get('track/:trackingId')
  async track(@Param('trackingId') trackingId: string) {
    return this.fulfillment.trackShipment(trackingId);
  }

  @UseGuards(RolesGuard)
  @Roles('LOGISTICS', 'ADMIN', 'SUPER_ADMIN')
  @Post('cod-reconciliation')
  async codReconciliation(@Body() body: { date: string }) {
    return this.fulfillment.processCODReconciliation(body.date);
  }
}
