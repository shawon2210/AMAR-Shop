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
import { WmsService } from './wms.service';

@UseGuards(AuthGuard('jwt'))
@Controller('wms')
export class WmsController {
  constructor(private readonly wms: WmsService) {}

  @Post('inbound')
  async receiveInventory(
    @Body()
    body: {
      inboundOrderId: string;
      items: {
        inboundItemId: string;
        receivedQty: number;
        damagedQty?: number;
        binId?: string;
      }[];
    },
  ) {
    return this.wms.receiveInventory(body.inboundOrderId, body.items);
  }

  @Post('inbound/orders')
  async createInboundOrder(
    @Body()
    body: {
      warehouseId: string;
      supplierName?: string;
      items: { productId: string; expectedQty: number; unitCost?: number }[];
    },
  ) {
    return this.wms.createInboundOrder(body);
  }

  @Get('inbound/orders')
  async listInboundOrders(@Query('warehouseId') warehouseId?: string) {
    return this.wms.listInboundOrders(warehouseId);
  }

  @Post('pick-lists')
  async generatePickList(@Body() body: { orderIds: string[] }) {
    return this.wms.generatePickList(body.orderIds);
  }

  @Get('pick-lists')
  async listPickLists(@Query('warehouseId') warehouseId?: string) {
    return this.wms.listPickLists(warehouseId);
  }

  @Put('picks/:id/confirm')
  async confirmPick(@Param('id') id: string, @Body() body: { binId: string }) {
    return this.wms.confirmPick(id, body.binId);
  }

  @Post('pack')
  async packOrder(
    @Body()
    body: {
      orderId: string;
      items: { productId: string; quantity: number }[];
    },
  ) {
    return this.wms.packOrder(body.orderId, body.items);
  }

  @Post('transfers')
  async transferStock(
    @Body()
    body: {
      fromWarehouse: string;
      toWarehouse: string;
      items: { productId: string; quantity: number }[];
    },
  ) {
    return this.wms.transferStock(
      body.fromWarehouse,
      body.toWarehouse,
      body.items,
    );
  }

  @Post('cycle-counts')
  async cycleCount(@Body() body: { warehouseId: string; zoneId?: string }) {
    return this.wms.cycleCount(body.warehouseId, body.zoneId);
  }

  @Get('dashboard/:warehouseId')
  async getDashboard(@Param('warehouseId') warehouseId: string) {
    return this.wms.getWarehouseDashboard(warehouseId);
  }

  @Get('stock-alerts/:warehouseId')
  async getStockAlerts(@Param('warehouseId') warehouseId: string) {
    return this.wms.getLowStockAlerts(warehouseId);
  }

  @Put('inventory/:id/move')
  async moveToBin(@Param('id') id: string, @Body() body: { binId: string }) {
    return this.wms.moveToBin(id, body.binId);
  }

  @Post('inventory/:id/damage')
  async markDamaged(
    @Param('id') id: string,
    @Body() body: { quantity: number; reason: string },
  ) {
    return this.wms.markDamaged(id, body.quantity, body.reason);
  }

  @Get('bins')
  async getBins(
    @Query('warehouseId') warehouseId: string,
    @Query('zone') zone?: string,
  ) {
    return this.wms.getBinLocation(warehouseId, zone);
  }

  @Get('inventory')
  async listInventory(@Query('warehouseId') warehouseId?: string) {
    return this.wms.listInventory(warehouseId);
  }

  @Get('inventory/by-bin')
  async getInventoryByBin(@Query('warehouseId') warehouseId: string) {
    return this.wms.getInventoryByBin(warehouseId);
  }
}
