import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('bkash/initiate')
  initiateBkash(
    @Request() req: any,
    @Body() body: { orderId: string; amount: number; customer: any },
  ) {
    return this.paymentsService.initiateBkashPayment(
      body.orderId,
      body.amount,
      body.customer,
      req.user.id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('nagad/initiate')
  initiateNagad(
    @Request() req: any,
    @Body() body: { orderId: string; amount: number; customer: any },
  ) {
    return this.paymentsService.initiateNagadPayment(
      body.orderId,
      body.amount,
      body.customer,
      req.user.id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('sslcommerz/initiate')
  initiateSSLCommerz(
    @Request() req: any,
    @Body() body: { orderId: string; amount: number; customer: any },
  ) {
    return this.paymentsService.initiateSSLCommerzPayment(
      body.orderId,
      body.amount,
      body.customer,
      req.user.id,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('cod')
  async processCod(
    @Request() req: any,
    @Body() body: { orderId: string },
  ) {
    return this.paymentsService.processCodOrder(body.orderId, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('verify/:provider/:transactionId')
  async verifyPayment(
    @Request() req: any,
    @Param('provider') provider: string,
    @Param('transactionId') transactionId: string,
  ) {
    return this.paymentsService.verifyPayment(provider, transactionId, req.user.id);
  }
}
