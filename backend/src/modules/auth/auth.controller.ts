import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body()
    body: {
      name: string;
      email?: string;
      phone: string;
      password: string;
    },
  ) {
    return this.authService.register(body);
  }

  @Post('login')
  async login(
    @Body() body: { email?: string; phone?: string; password: string },
  ) {
    const identity = body.email || body.phone;
    if (!identity) {
      return { message: 'Email or phone is required' };
    }
    return this.authService.login(identity, body.password);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return this.authService.refresh(body.refreshToken);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Request() req: any) {
    return this.authService.logout(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout-all')
  async logoutAll(@Request() req: any) {
    return this.authService.logoutAll(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async getProfile(@Request() req: any) {
    return this.authService.getProfile(req.user.id);
  }
}
