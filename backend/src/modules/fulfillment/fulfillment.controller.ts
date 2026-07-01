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
import { FulfillmentService } from './fulfillment.service';

@UseGuards(AuthGuard('jwt'))
@Controller('fulfillment')
export class FulfillmentController {
  constructor(private readonly fulfillment: FulfillmentService) {}

  @Post('assign')
  async assign(@Body() body: { orderId: string }) {
    return this.fulfillment.assignWarehouse(body.orderId);
  }

  @Post('shipments')
  async createShipment(@Body() body: { orderId: string }) {
    return this.fulfillment.createShipment(body.orderId);
  }

  @Get('delivery-slots')
  async getDeliverySlots(@Query('pincode') pincode: string) {
    return this.fulfillment.getDeliverySlots(pincode);
  }

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

  @Post('cod-reconciliation')
  async codReconciliation(@Body() body: { date: string }) {
    return this.fulfillment.processCODReconciliation(body.date);
  }
}
