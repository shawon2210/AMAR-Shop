import {
  Controller, Get, Post, Put, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AdminFinanceService } from '../services/finance.service';
import {
  GenerateSettlementDto, ProcessSettlementDto,
  CreateInvoiceDto, UpdateInvoiceDto,
  UpdateAffiliateDto,
} from '../dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminFinanceController {
  constructor(private readonly financeService: AdminFinanceService) {}

  @Get('finance/dashboard')
  async getFinanceDashboard() {
    return this.financeService.getFinanceDashboard();
  }

  @Get('finance/settlements')
  async getSettlements(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.financeService.getSettlements({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
    });
  }

  @Post('finance/settlements')
  async generateSettlement(@Body() dto: GenerateSettlementDto) {
    return this.financeService.generateSettlement(dto);
  }

  @Put('finance/settlements/:id')
  async processSettlement(@Param('id') id: string, @Body() dto: ProcessSettlementDto) {
    return this.financeService.processSettlement(id, dto.status);
  }

  @Get('finance/invoices')
  async getInvoices(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.financeService.getInvoices({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Post('finance/invoices')
  async createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.financeService.createInvoice(dto);
  }

  @Put('finance/invoices/:id')
  async updateInvoice(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.financeService.updateInvoice(id, dto);
  }

  @Get('finance/tax')
  async getTaxReport(
    @Query('quarter') quarter: string,
    @Query('year') year: string,
  ) {
    return this.financeService.getTaxReport(quarter || '1', year || '2026');
  }

  @Get('finance/escrow')
  async getEscrowTransactions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.financeService.getEscrowTransactions({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get('finance/credit-notes')
  async getCreditNotes() {
    return this.financeService.getCreditNotes();
  }

  @Get('finance/commissions')
  async getCommissions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.financeService.getCommissions({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get('affiliates')
  async getAdminAffiliates(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.financeService.getAdminAffiliates({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
    });
  }

  @Put('affiliates/:id')
  async updateAdminAffiliate(@Param('id') id: string, @Body() dto: UpdateAffiliateDto) {
    return this.financeService.updateAdminAffiliate(id, dto.status);
  }
}
