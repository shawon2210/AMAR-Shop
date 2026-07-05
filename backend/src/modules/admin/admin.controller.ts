import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('users')
  async getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.getUsers({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      search,
      role,
    });
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateUser(id, body);
  }

  @Post('users')
  async createAdminUser(@Body() body: any) {
    return this.adminService.createAdminUser(body);
  }

  @Put('sellers/:id')
  async updateSeller(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateSeller(id, body);
  }

  @Put('sellers/:id/store-status')
  async toggleStoreStatus(@Param('id') id: string) {
    return this.adminService.toggleStoreStatus(id);
  }

  @Get('sellers')
  async getSellers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('kycStatus') kycStatus?: string,
  ) {
    return this.adminService.getSellers({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      search,
      kycStatus,
    });
  }

  @Post('sellers/:id/approve')
  async approveSeller(@Param('id') id: string) {
    return this.adminService.approveSeller(id);
  }

  @Post('sellers/:id/reject')
  async rejectSeller(@Param('id') id: string, @Body('reason') reason: string) {
    return this.adminService.rejectSeller(id, reason);
  }

  @Get('products')
  async getProducts(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    return this.adminService.getProducts({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
      search,
      category,
    });
  }

  @Put('products/:id')
  async updateProduct(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateProduct(id, body);
  }

  @Post('products')
  async createProduct(@Body() body: any) {
    return this.adminService.createProduct(body);
  }

  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string) {
    return this.adminService.deleteProduct(id);
  }

  @Post('products/:id/approve')
  async approveProduct(@Param('id') id: string) {
    return this.adminService.approveProduct(id);
  }

  @Post('products/:id/reject')
  async rejectProduct(@Param('id') id: string, @Body('reason') reason: string) {
    return this.adminService.rejectProduct(id, reason);
  }

  @Put('orders/:id/status')
  async updateOrderStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.adminService.updateOrderStatus(id, status);
  }

  @Post('orders/:id/notes')
  async addOrderNote(@Param('id') id: string, @Body('note') note: string) {
    return this.adminService.addOrderNote(id, note);
  }

  @Get('orders')
  async getOrders(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.adminService.getOrders({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
      from,
      to,
    });
  }

  @Get('payments')
  async getPayments(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.adminService.getPayments({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
      from,
      to,
    });
  }

  @Get('flash-sales')
  async getFlashSales() {
    return this.adminService.getFlashSales();
  }

  @Post('flash-sales')
  async createFlashSale(@Body() body: any) {
    return this.adminService.createFlashSale(body);
  }

  @Put('flash-sales/:id')
  async updateFlashSale(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateFlashSale(id, body);
  }

  @Delete('flash-sales/:id')
  async deleteFlashSale(@Param('id') id: string) {
    return this.adminService.deleteFlashSale(id);
  }

  @Post('flash-sales/:id/products')
  async addCampaignProduct(@Param('id') id: string, @Body() body: any) {
    return this.adminService.addCampaignProduct(id, body);
  }

  @Get('categories')
  async getCategories() {
    return this.adminService.getCategories();
  }

  @Post('categories')
  async createCategory(@Body() body: any) {
    return this.adminService.createCategory(body);
  }

  @Put('categories/:id')
  async updateCategory(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateCategory(id, body);
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.adminService.deleteCategory(id);
  }

  @Get('banners')
  async getBanners() {
    return this.adminService.getBanners();
  }

  @Post('banners')
  async createBanner(@Body() body: any) {
    return this.adminService.createBanner(body);
  }

  @Put('banners/:id')
  async updateBanner(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateBanner(id, body);
  }

  @Delete('banners/:id')
  async deleteBanner(@Param('id') id: string) {
    return this.adminService.deleteBanner(id);
  }

  @Get('coupons')
  async getCoupons(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.adminService.getCoupons({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      isActive: isActive !== undefined ? isActive === 'true' : undefined,
    });
  }

  @Post('coupons')
  async createCoupon(@Body() body: any) {
    return this.adminService.createCoupon(body);
  }

  @Put('coupons/:id')
  async updateCoupon(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateCoupon(id, body);
  }

  @Delete('coupons/:id')
  async deleteCoupon(@Param('id') id: string) {
    return this.adminService.deleteCoupon(id);
  }

  @Get('cms/pages')
  async getCMSPages() {
    return this.adminService.getCMSPages();
  }

  @Post('cms/pages')
  async createCMSPage(@Body() body: any) {
    return this.adminService.createCMSPage(body);
  }

  @Put('cms/pages/:id')
  async updateCMSPage(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateCMSPage(id, body);
  }

  @Delete('cms/pages/:id')
  async deleteCMSPage(@Param('id') id: string) {
    return this.adminService.deleteCMSPage(id);
  }

  @Get('cms/announcements')
  async getAnnouncements() {
    return this.adminService.getAnnouncements();
  }

  @Post('cms/announcements')
  async createAnnouncement(@Body() body: any) {
    return this.adminService.createAnnouncement(body);
  }

  @Put('cms/announcements/:id')
  async updateAnnouncement(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateAnnouncement(id, body);
  }

  @Delete('cms/announcements/:id')
  async deleteAnnouncement(@Param('id') id: string) {
    return this.adminService.deleteAnnouncement(id);
  }

  @Get('analytics')
  async getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Get('reports/:type')
  async getReports(
    @Param('type') type: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.adminService.getReports(type, { from, to });
  }

  @Put('settings')
  async updateSettings(@Body() body: any) {
    return this.adminService.updateSettings(body);
  }

  @Get('support-tickets')
  async getSupportTickets(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.adminService.getSupportTickets({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
      priority,
    });
  }

  @Get('support-tickets/:id')
  async getSupportTicket(@Param('id') id: string) {
    return this.adminService.getSupportTicket(id);
  }

  @Post('support-tickets/:id/reply')
  async replyToTicket(
    @Param('id') id: string,
    @Request() req: any,
    @Body('content') content: string,
  ) {
    return this.adminService.replyToTicket(id, req.user.id, content);
  }

  @Put('support-tickets/:id')
  async updateSupportTicket(
    @Param('id') id: string,
    @Body() body: { status?: string; priority?: string; assignedTo?: string },
  ) {
    return this.adminService.updateSupportTicket(id, body);
  }

  // ─── Phase 3: Finance ────────────────────────────────

  @Get('finance/dashboard')
  async getFinanceDashboard() {
    return this.adminService.getFinanceDashboard();
  }

  @Get('finance/settlements')
  async getSettlements(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getSettlements({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
    });
  }

  @Post('finance/settlements')
  async generateSettlement(@Body() body: any) {
    return this.adminService.generateSettlement(body);
  }

  @Put('finance/settlements/:id')
  async processSettlement(@Param('id') id: string, @Body() body: any) {
    return this.adminService.processSettlement(id, body);
  }

  @Get('finance/invoices')
  async getInvoices(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getInvoices({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Post('finance/invoices')
  async createInvoice(@Body() body: any) {
    return this.adminService.createInvoice(body);
  }

  @Put('finance/invoices/:id')
  async updateInvoice(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateInvoice(id, body);
  }

  @Get('finance/tax')
  async getTaxReport(
    @Query('quarter') quarter: string,
    @Query('year') year: string,
  ) {
    return this.adminService.getTaxReport(quarter || '1', year || '2026');
  }

  @Get('finance/escrow')
  async getEscrowTransactions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getEscrowTransactions({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Get('finance/credit-notes')
  async getCreditNotes() {
    return this.adminService.getCreditNotes();
  }

  @Get('finance/commissions')
  async getCommissions(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getCommissions({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  // ─── Phase 4: Reviews ─────────────────────────────────

  @Get('reviews')
  async getReviews(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getReviews({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
    });
  }

  @Put('reviews/:id')
  async updateReview(
    @Param('id') id: string,
    @Body() body: { status?: string; reported?: boolean },
  ) {
    return this.adminService.updateReview(id, body);
  }

  @Delete('reviews/:id')
  async deleteReview(@Param('id') id: string) {
    return this.adminService.deleteReview(id);
  }

  // ─── Phase 4: Affiliates (admin) ──────────────────────

  @Get('affiliates')
  async getAdminAffiliates(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getAdminAffiliates({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
    });
  }

  @Put('affiliates/:id')
  async updateAdminAffiliate(
    @Param('id') id: string,
    @Body() body: { status?: string },
  ) {
    return this.adminService.updateAdminAffiliate(id, body);
  }

  // ─── Phase 4: Creators (admin) ────────────────────────

  @Get('creators')
  async getAdminCreators(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.adminService.getAdminCreators({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Put('creators/:id')
  async updateAdminCreator(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.adminService.updateAdminCreator(id, body);
  }

  // ─── Phase 4: Compliance ──────────────────────────────

  @Get('compliance')
  async getComplianceDashboard() {
    return this.adminService.getComplianceDashboard();
  }
}
