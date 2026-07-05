import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { AffiliateService } from './affiliate.service';
import { PrismaService } from '../../common/prisma.service';

@Controller()
export class AffiliateController {
  constructor(
    private readonly affiliateService: AffiliateService,
    private readonly prisma: PrismaService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('api/affiliate/register')
  async register(
    @Request() req: any,
    @Body()
    body: { bio?: string; socialLinks?: string[]; promoMethods?: string[] },
  ) {
    return this.affiliateService.registerAffiliate(req.user.id, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/affiliate/dashboard')
  async getDashboard(@Request() req: any) {
    const profile = await this.getAffiliateProfile(req.user.id);
    return this.affiliateService.getAffiliateDashboard(profile.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('api/affiliate/tracking-links')
  async createTrackingLink(
    @Request() req: any,
    @Body() body: { productId: string; campaign?: string },
  ) {
    const profile = await this.getAffiliateProfile(req.user.id);
    return this.affiliateService.generateTrackingLink(
      body.productId,
      profile.id,
      body.campaign,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/affiliate/analytics')
  async getAnalytics(
    @Request() req: any,
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    const profile = await this.getAffiliateProfile(req.user.id);
    return this.affiliateService.getAffiliateAnalytics(profile.id, {
      start,
      end,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/affiliate/payouts')
  async getPayouts(@Request() req: any) {
    const profile = await this.getAffiliateProfile(req.user.id);
    return this.affiliateService.getAffiliatePayouts(profile.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('api/affiliate/payouts/request')
  async requestPayout(@Request() req: any, @Body() body: { amount: number }) {
    const profile = await this.getAffiliateProfile(req.user.id);
    return this.affiliateService.requestPayout(profile.id, body.amount);
  }

  @Get('api/affiliate/top')
  async getTopAffiliates(
    @Query('start') start: string,
    @Query('end') end: string,
  ) {
    return this.affiliateService.getTopAffiliates({ start, end });
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('api/affiliate/products')
  async getProducts(@Request() req: any) {
    const profile = await this.getAffiliateProfile(req.user.id);
    return this.affiliateService.getAvailableProducts(profile.id);
  }

  @Get('t/:shortCode')
  async redirectTracking(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
    @Query() query: any,
  ) {
    const result = await this.affiliateService.validateTracking(shortCode);
    if (!result.valid || !result.link) {
      return res.redirect(302, '/');
    }
    const productSlug = result.link.product?.slug || '';
    await this.affiliateService.recordClick(shortCode, {
      referrer: query.ref || 'direct',
      device: 'web',
      location: 'unknown',
    });
    return res.redirect(302, `/product/${productSlug}`);
  }

  private async getAffiliateProfile(userId: string) {
    const profile = await this.prisma.affiliateProfile.findUnique({
      where: { userId },
    });
    if (!profile) {
      throw new NotFoundException(
        'Affiliate profile not found. Please register first.',
      );
    }
    return profile;
  }
}
