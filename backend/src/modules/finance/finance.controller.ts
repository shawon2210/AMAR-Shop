import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FinanceService } from './finance.service';

@UseGuards(AuthGuard('jwt'))
@Controller('api/finance')
export class FinanceController {
  constructor(private readonly finance: FinanceService) {}

  @Get('escrow')
  async getEscrow(@Query('orderId') orderId?: string) {
    return this.finance.getEscrowStatus(orderId);
  }

  @Post('escrow')
  async createEscrow(@Body() body: { orderId: string; amount: number }) {
    return this.finance.createEscrow(body.orderId, body.amount);
  }

  @Post('escrow/release')
  async releaseEscrow(@Body() body: { orderId: string }) {
    return this.finance.releaseEscrow(body.orderId);
  }

  @Post('escrow/refund')
  async refundEscrow(@Body() body: { orderId: string; amount: number }) {
    return this.finance.refundToEscrow(body.orderId, body.amount);
  }

  @Get('settlements')
  async getSettlements(@Query('sellerId') sellerId?: string) {
    return this.finance.listSettlements(sellerId);
  }

  @Post('settlements')
  async generateSettlement(@Body() body: { sellerId: string; start: string; end: string }) {
    return this.finance.generateSellerSettlement(body.sellerId, { start: body.start, end: body.end });
  }

  @Post('settlements/process')
  async processSettlement(@Body() body: { settlementId: string }) {
    return this.finance.processSettlement(body.settlementId);
  }

  @Get('accounting')
  async getAccounting(@Query('start') start?: string, @Query('end') end?: string) {
    return this.finance.getAccountingEntries(start && end ? { start, end } : undefined);
  }

  @Get('tax-report')
  async getTaxReport(@Query('quarter') quarter?: string, @Query('year') year?: string) {
    return this.finance.generateTaxReport(parseInt(quarter || '1'), parseInt(year || '2026'));
  }

  @Get('cash-flow')
  async getCashFlow(@Query('start') start: string, @Query('end') end: string) {
    return this.finance.getCashFlow({ start, end });
  }

  @Get('revenue-forecast')
  async getRevenueForecast(@Query('months') months?: string) {
    return this.finance.getRevenueForecast(parseInt(months ?? '6'));
  }

  @Get('balance-sheet')
  async getBalanceSheet(@Query('date') date?: string) {
    return this.finance.getBalanceSheet(date || new Date().toISOString().split('T')[0]);
  }

  @Get('profit-loss')
  async getProfitAndLoss(@Query('start') start: string, @Query('end') end: string) {
    return this.finance.getProfitAndLoss({ start, end });
  }

  @Post('invoices')
  async createInvoice(@Body() body: { orderId: string }) {
    return this.finance.createInvoice(body.orderId);
  }

  @Get('invoices')
  async listInvoices(@Query('orderId') orderId?: string) {
    return this.finance.listInvoices(orderId);
  }

  @Post('credit-notes')
  async createCreditNote(@Body() body: { returnId: string }) {
    return this.finance.createCreditNote(body.returnId);
  }

  @Post('reconcile')
  async reconcile(@Body() body: { date: string }) {
    return this.finance.reconcilePayments(body.date);
  }

  @Get('commission')
  async calculateCommission(@Query('orderId') orderId: string) {
    return this.finance.calculateCommission(orderId);
  }
}
