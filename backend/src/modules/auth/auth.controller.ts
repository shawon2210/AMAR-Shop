import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { ttl: 60000, limit: 3 } })
  @Post('register')
  async register(
    @Body()
    body: {
      name: string;
      email?: string;
      phone: string;
      password: string;
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(body);
    this.setTokenCookies(res, result.accessToken, result.refreshToken);
    return { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken, expiresAt: result.expiresAt };
  }

  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('login')
  async login(
    @Body() body: { email?: string; phone?: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const identity = body.email || body.phone;
    if (!identity) {
      return { message: 'Email or phone is required' };
    }
    const result = await this.authService.login(identity, body.password);
    this.setTokenCookies(res, result.accessToken, result.refreshToken);
    return { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken, expiresAt: result.expiresAt };
  }

  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @Post('refresh')
  async refresh(
    @Request() req: any,
    @Body() body: { refreshToken?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = body?.refreshToken || req.cookies?.refreshToken;
    if (!refreshToken) {
      return { message: 'Refresh token not found' };
    }
    const result = await this.authService.refresh(refreshToken);
    this.setTokenCookies(res, result.accessToken, result.refreshToken);
    return { user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken, expiresAt: result.expiresAt };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Request() req: any,
    @Body() body: { refreshToken?: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = body?.refreshToken || req.cookies?.refreshToken;
    await this.authService.logout(req.user.id, refreshToken);
    this.clearTokenCookies(res);
    return { message: 'Logged out successfully' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  async logoutAll(
    @Request() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logoutAll(req.user.id);
    this.clearTokenCookies(res);
    return { message: 'Logged out from all devices' };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('sessions')
  async getSessions(
    @Request() req: any,
    @Query('currentToken') currentToken?: string,
  ) {
    return this.authService.getSessions(req.user.id, currentToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout-all-except')
  @HttpCode(HttpStatus.OK)
  async logoutAllExcept(
    @Request() req: any,
    @Body() body: { refreshToken?: string },
  ) {
    const refreshToken = body?.refreshToken || req.cookies?.refreshToken;
    if (!refreshToken) {
      return { message: 'Current session token is required' };
    }
    return this.authService.logoutAllExcept(req.user.id, refreshToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('sessions/:id/revoke')
  @HttpCode(HttpStatus.OK)
  async revokeSession(
    @Request() req: any,
    @Param('id') sessionId: string,
  ) {
    return this.authService.revokeSession(req.user.id, sessionId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }

  private setTokenCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict' as const,
      path: '/',
    };

    res.cookie('accessToken', accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }

  private clearTokenCookies(res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/',
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      path: '/',
    });
  }
}
