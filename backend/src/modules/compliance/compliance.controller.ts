import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ComplianceService } from './compliance.service';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('status')
  getStatus() {
    return this.complianceService.getComplianceStatus();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('kyc')
  async runKYC(
    @Request() req: any,
    @Body()
    body: {
      documentType: string;
      documentNumber: string;
      imageFront: string;
      imageBack?: string;
    },
  ) {
    return this.complianceService.runKYC(req.user.id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('kyc/status')
  getKYCStatus() {
    return { status: 'pending' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('gdpr/export')
  async exportGDPR(@Request() req: any) {
    return this.complianceService.generateGDPRReport(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('gdpr/account')
  async deleteAccount(@Request() req: any) {
    return this.complianceService.deleteUserData(req.user.id);
  }

  @Put('cookie-consent')
  updateCookieConsent() {
    return this.complianceService.logConsent();
  }

  @Get('privacy')
  getPrivacy() {
    return this.complianceService.getPrivacyCenter();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Get('logs')
  async getLogs(@Query('start') start: string, @Query('end') end: string) {
    return this.complianceService.getComplianceLogs({ start, end });
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  @Post('aml/check')
  async checkAML(@Body() body: { userId: string }) {
    return this.complianceService.checkAML(body.userId);
  }
}
