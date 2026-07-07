import { Controller, Get, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AdminDashboardService } from '../services/dashboard.service';
import { UpdateSettingsDto } from '../dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminDashboardController {
  constructor(private readonly dashboardService: AdminDashboardService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.dashboardService.getDashboard();
  }

  @Get('analytics')
  async getAnalytics() {
    return this.dashboardService.getAnalytics();
  }

  @Get('reports/:type')
  async getReports(
    @Param('type') type: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.dashboardService.getReports(type, { from, to });
  }

  @Put('settings')
  async updateSettings(@Body() dto: UpdateSettingsDto) {
    return this.dashboardService.updateSettings(dto.commissionRate);
  }

  @Get('compliance')
  async getComplianceDashboard() {
    return this.dashboardService.getComplianceDashboard();
  }
}
