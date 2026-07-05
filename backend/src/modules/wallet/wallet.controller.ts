import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WalletService } from './wallet.service';

@UseGuards(AuthGuard('jwt'))
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  async getBalance(@Request() req: any) {
    return this.walletService.getBalance(req.user.id);
  }

  @Get('transactions')
  async getTransactions(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('type') type?: string,
  ) {
    return this.walletService.getTransactions(req.user.id, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      type,
    });
  }

  @Post('deposit')
  async deposit(
    @Request() req: any,
    @Body() body: { amount: number; method: string },
  ) {
    return this.walletService.addFunds(req.user.id, body.amount, body.method);
  }

  @Post('payout')
  async requestPayout(
    @Request() req: any,
    @Body() body: { amount: number; method: string },
  ) {
    return this.walletService.requestPayout(
      req.user.id,
      body.amount,
      body.method,
    );
  }
}
