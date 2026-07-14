import crypto from 'node:crypto';
import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma.service';
import { PaymentStatus } from '../../common/types';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async initiateBkashPayment(orderId: string, amount: number, customer: any) {
    try {
      const callbackUrl = this.configService.get('BKASH_CALLBACK_URL');
      const username = this.configService.get('BKASH_USERNAME');
      const password = this.configService.get('BKASH_PASSWORD');
      const appKey = this.configService.get('BKASH_APP_KEY');
      const appSecret = this.configService.get('BKASH_APP_SECRET');
      const pk = this.configService.get('BKASH_PK');

      if (
        !callbackUrl ||
        !username ||
        !password ||
        !appKey ||
        !appSecret ||
        !pk
      ) {
        throw new Error('bKash payment configuration is incomplete');
      }

      const paymentId = crypto.randomUUID();
      const idempotencyKey = crypto.randomUUID();

      const bkashApi: AxiosInstance = axios.create({
        baseURL: 'https://tokenized.sandbox.bka.sh/v1.0.0/',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${pk}`,
          'X-Request-ID': idempotencyKey,
        },
      });

      const tokenResponse = await bkashApi.post('/tokenized/bkash/token/get', {
        app_key: appKey,
        app_secret: appSecret,
      });

      const token = tokenResponse.data.id_token;

      const createPaymentData = {
        amount: amount.toString(),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: orderId,
        customerMsisdn: customer.phone,
        customerName: customer.name,
        customerEmail: customer.email,
        customerCity: customer.city,
        callBackURL: callbackUrl,
        mode: '0000',
      };

      const createPaymentResponse = await bkashApi.post(
        '/tokenized/bkash/execute',
        createPaymentData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'X-Request-ID': idempotencyKey,
            'Content-Type': 'application/json',
          },
        },
      );

      const { paymentID, bkashReference, status } = createPaymentResponse.data;

      await this.prisma.paymentTransaction.create({
        data: {
          id: paymentID,
          provider: 'BKASH',
          method: 'BKASH',
          orderId,
          amount,
          netAmount: amount,
          status: this.mapBkashStatus(status),
          customerName: customer.name,
          customerPhone: customer.phone,
          callbackUrl,
          metadata: {
            reference: bkashReference,
            token,
            createPaymentData,
          },
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        },
      });

      this.logPaymentEvent('BKASH_INITIATED', {
        paymentId,
        orderId,
        amount,
        provider: 'BKASH',
        customer: customer.phone,
      });

      return {
        success: true,
        paymentUrl: createPaymentResponse.data.bkashURL,
        transactionId: paymentID,
        reference: bkashReference,
        status: this.mapBkashStatus(status),
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
        message: 'bKash payment initiated successfully',
      };
    } catch (error) {
      this.logger.error('Failed to initiate bKash payment', error.stack);
      this.logPaymentEvent('BKASH_INITIATION_FAILED', {
        orderId,
        amount,
        error: error.message,
      });

      throw new BadRequestException(
        `Failed to initiate bKash payment: ${error.message}`,
      );
    }
  }

  async initiateNagadPayment(orderId: string, amount: number, customer: any) {
    try {
      const callbackUrl = this.configService.get('NAGAD_CALLBACK_URL');
      const merchantId = this.configService.get('NAGAD_MERCHANT_ID');
      const merchantSecret = this.configService.get('NAGAD_MERCHANT_SECRET');

      if (!callbackUrl || !merchantId || !merchantSecret) {
        throw new Error('Nagad payment configuration is incomplete');
      }

      const paymentId = crypto.randomUUID();
      const idempotencyKey = crypto.randomUUID();

      const nagadApi: AxiosInstance = axios.create({
        baseURL: 'https://api.nagad.com/api/v1/',
        headers: {
          'Content-Type': 'application/json',
          'Request-Id': idempotencyKey,
        },
      });

      const initPayment = {
        merchantId,
        amount: amount.toString(),
        currency: 'BDT',
        customerMobile: customer.phone,
        customerName: customer.name,
        customerEmail: customer.email,
        callbackUrl,
        orderId,
        trxId: paymentId,
        merchantCallbackURL: callbackUrl,
      };

      const tokenResponse = await nagadApi.post('/otp/generate', initPayment);
      const { txnId, referenceNo, mobileNumber } = tokenResponse.data;

      await this.prisma.paymentTransaction.create({
        data: {
          id: txnId,
          provider: 'NAGAD',
          method: 'NAGAD',
          orderId,
          amount,
          netAmount: amount,
          status: PaymentStatus.PENDING,
          customerName: customer.name,
          customerPhone: customer.phone,
          callbackUrl,
          metadata: {
            reference: referenceNo,
            initPayment,
          },
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        },
      });

      const paymentUrl = `https://api.nagad.com/api/v1/callback?transactionId=${txnId}&referenceNo=${referenceNo}`;

      this.logPaymentEvent('NAGAD_INITIATED', {
        paymentId: txnId,
        orderId,
        amount,
        provider: 'NAGAD',
        customer: customer.phone,
      });

      return {
        success: true,
        paymentUrl,
        transactionId: txnId,
        reference: referenceNo,
        status: PaymentStatus.PENDING,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        message: 'Nagad payment initiated successfully',
        mobileNumber,
      };
    } catch (error) {
      this.logger.error('Failed to initiate Nagad payment', error.stack);
      this.logPaymentEvent('NAGAD_INITIATION_FAILED', {
        orderId,
        amount,
        error: error.message,
      });

      throw new BadRequestException(
        `Failed to initiate Nagad payment: ${error.message}`,
      );
    }
  }

  async initiateSSLCommerzPayment(
    orderId: string,
    amount: number,
    customer: any,
  ) {
    try {
      const storeId = this.configService.get('SSLCOMMERZ_STORE_ID');
      const storePassword = this.configService.get('SSLCOMMERZ_STORE_PASSWORD');
      const sandbox = this.configService.get('SSLCOMMERZ_SANDBOX') === 'true';

      if (!storeId || !storePassword) {
        throw new Error('SSLCommerz payment configuration is incomplete');
      }

      const paymentId = crypto.randomUUID();
      const currency = 'BDT';
      const successUrl = this.configService.get('SSLCOMMERZ_SUCCESS_URL');
      const failUrl = this.configService.get('SSLCOMMERZ_FAIL_URL');
      const cancelUrl = this.configService.get('SSLCOMMERZ_CANCEL_URL');
      const ipnUrl = this.configService.get('SSLCOMMERZ_IPN_URL');

      const sslcommerzApi: AxiosInstance = axios.create({
        baseURL: sandbox
          ? 'https://sandbox.sslcommerz.com/'
          : 'https://securepay.sslcommerz.com/',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const initData = {
        store_id: storeId,
        store_pass: storePassword,
        total_amount: amount.toString(),
        currency: currency,
        tran_id: paymentId,
        success_url: successUrl || 'http://localhost:3000/payments/success',
        fail_url: failUrl || 'http://localhost:3000/payments/failed',
        cancel_url: cancelUrl || 'http://localhost:3000/payments/cancelled',
        ipn_url: ipnUrl || 'http://localhost:3000/api/payments/ipn',
        cus_name: customer.name,
        cus_email: customer.email,
        cus_phone: customer.phone,
        cus_add1: customer.address?.line1,
        cus_add2: customer.address?.line2,
        cus_city: customer.address?.city,
        cus_country: customer.address?.country,
        shipping_method: 'N/A',
        product_name: orderId,
        product_category: 'E-commerce',
        product_profile: 'general',
      };

      const response = await sslcommerzApi.post(
        '/gwprocess/v4/api.php',
        new URLSearchParams(initData),
      );

      const { gatewayPageURL, val_id, tran_id } = response.data;

      await this.prisma.paymentTransaction.create({
        data: {
          id: tran_id,
          provider: 'SSLCOMMERZ',
          method: 'SSLCOMMERZ',
          orderId,
          amount,
          netAmount: amount,
          status: PaymentStatus.PENDING,
          customerName: customer.name,
          customerPhone: customer.phone,
          ipnUrl: ipnUrl || 'http://localhost:3000/api/payments/ipn',
          metadata: {
            val_id,
            gatewayPageURL,
            initData,
          },
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      this.logPaymentEvent('SSLCOMMERZ_INITIATED', {
        paymentId: tran_id,
        orderId,
        amount,
        provider: 'SSLCOMMERZ',
        customer: customer.phone,
      });

      return {
        success: true,
        gatewayUrl: gatewayPageURL,
        transactionId: tran_id,
        valId: val_id,
        status: PaymentStatus.PENDING,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        message: 'SSLCommerz payment initiated successfully',
        storeId,
      };
    } catch (error) {
      this.logger.error('Failed to initiate SSLCommerz payment', error.stack);
      this.logPaymentEvent('SSLCOMMERZ_INITIATION_FAILED', {
        orderId,
        amount,
        error: error.message,
      });

      throw new BadRequestException(
        `Failed to initiate SSLCommerz payment: ${error.message}`,
      );
    }
  }

  async verifyPayment(provider: string, transactionId: string) {
    try {
      const payment = await this.prisma.paymentTransaction.findUnique({
        where: { id: transactionId },
        include: { order: true },
      });

      if (!payment) {
        this.logPaymentEvent('PAYMENT_VERIFY_FAILED', {
          transactionId,
          error: 'Payment not found',
        });
        throw new BadRequestException('Payment not found');
      }

      this.logPaymentEvent('PAYMENT_VERIFY_INITIATED', {
        transactionId,
        provider,
        currentStatus: payment.status,
      });

      let verified = false;
      let status = payment.status;

      switch (provider) {
        case 'BKASH':
          verified = await this.verifyBkashPayment(payment);
          status = verified
            ? this.mapBkashStatus((payment.metadata as any)?.status)
            : PaymentStatus.FAILED;
          break;
        case 'NAGAD':
          verified = await this.verifyNagadPayment(payment);
          status = verified ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
          break;
        case 'SSLCOMMERZ':
          verified = await this.verifySSLCommerzPayment(payment);
          status = verified ? PaymentStatus.COMPLETED : PaymentStatus.FAILED;
          break;
        default:
          throw new BadRequestException(
            `Unsupported payment provider: ${provider}`,
          );
      }

      if (verified) {
        await this.prisma.paymentTransaction.update({
          where: { id: transactionId },
          data: { status, verifiedAt: new Date() },
        });
      }

      this.logPaymentEvent('PAYMENT_VERIFIED', {
        transactionId,
        provider,
        verified,
        status,
      });

      return {
        verified,
        transactionId,
        provider,
        status,
        payment,
        message: verified
          ? 'Payment verification successful'
          : 'Payment verification failed',
      };
    } catch (error) {
      this.logger.error('Payment verification failed', error.stack);
      this.logPaymentEvent('PAYMENT_VERIFICATION_ERROR', {
        transactionId,
        provider,
        error: error.message,
      });

      throw new BadRequestException(
        `Payment verification failed: ${error.message}`,
      );
    }
  }

  async processCodOrder(orderId: string) {
    try {
      const order = await this.prisma.order.findUnique({
        where: { id: orderId },
        include: { user: true },
      });

      if (!order) {
        throw new BadRequestException('Order not found');
      }

      if (order.paymentMethod !== 'COD') {
        throw new BadRequestException('Order payment method is not COD');
      }

      if (order.status !== 'PENDING') {
        throw new BadRequestException('Order status is not PENDING');
      }

      const updatedOrder = await this.prisma.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: false,
          status: 'CONFIRMED',
        },
      });

      await this.prisma.paymentTransaction.create({
        data: {
          id: `COD-${orderId}`,
          provider: 'COD',
          method: 'COD',
          orderId,
          amount: order.total,
          netAmount: order.total,
          status: 'PENDING',
          customerName: order.user?.name || '',
          customerPhone: order.user?.phone || '',
          metadata: {
            cod: true,
            notes: order.note,
          },
          createdAt: new Date(),
        },
      });

      this.logPaymentEvent('COD_ORDER_PROCESSED', {
        orderId,
        amount: order.total,
        customer: order.user?.phone || '',
      });

      return { message: 'COD order confirmed', orderId, order: updatedOrder };
    } catch (error) {
      this.logger.error('Failed to process COD order', error.stack);
      throw new BadRequestException(
        `Failed to process COD order: ${error.message}`,
      );
    }
  }

  private async verifyBkashPayment(payment: any): Promise<boolean> {
    if (!payment.metadata?.token) {
      return false;
    }

    try {
      const bkashApi: AxiosInstance = axios.create({
        baseURL: 'https://tokenized.sandbox.bka.sh/v1.0.0/',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${payment.metadata.token}`,
        },
      });

      const response = await bkashApi.post('/tokenized/bkash/execute', {
        paymentID: payment.id,
      });

      const status = response.data.status;
      return status === 'Completed' || status === 'Paid';
    } catch (error) {
      this.logger.error('Failed to verify bKash payment', error.stack);
      return false;
    }
  }

  private async verifyNagadPayment(payment: any): Promise<boolean> {
    try {
      const nagadApi: AxiosInstance = axios.create({
        baseURL: 'https://api.nagad.com/api/v1/',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await nagadApi.post('/verification', {
        txnId: payment.id,
        referenceNo: payment.metadata?.reference,
        amount: payment.amount.toString(),
      });

      return response.data.success === true;
    } catch (error) {
      this.logger.error('Failed to verify Nagad payment', error.stack);
      return false;
    }
  }

  private async verifySSLCommerzPayment(payment: any): Promise<boolean> {
    try {
      const { val_id } = payment.metadata || {};
      if (!val_id) return false;

      const sslcommerzApi: AxiosInstance = axios.create({
        baseURL: 'https://securepay.sslcommerz.com/',
      });

      const formData = new URLSearchParams();
      formData.append('val_id', val_id);
      formData.append(
        'store_id',
        this.configService.get('SSLCOMMERZ_STORE_ID') ?? '',
      );
      formData.append(
        'store_passwd',
        this.configService.get('SSLCOMMERZ_STORE_PASSWORD') ?? '',
      );

      const response = await sslcommerzApi.post(
        '/validator/api/validationserverAPI.php',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data.status === 'VALID';
    } catch (error) {
      this.logger.error('Failed to verify SSLCommerz payment', error.stack);
      return false;
    }
  }

  private mapBkashStatus(status: string): string {
    const statusMap: Record<string, string> = {
      Completed: PaymentStatus.COMPLETED,
      Paid: PaymentStatus.COMPLETED,
      Initiated: PaymentStatus.PENDING,
      Canceled: PaymentStatus.CANCELLED,
      Failed: PaymentStatus.FAILED,
    };

    return statusMap[status] || PaymentStatus.PENDING;
  }

  private logPaymentEvent(eventType: string, metadata: any): void {
    this.logger.log(`Payment Event: ${eventType}`, metadata);
  }

  async findByOrderId(orderId: string): Promise<any> {
    return this.prisma.paymentTransaction.findFirst({
      where: { orderId },
      include: { order: true },
    });
  }

  async getTransactionHistory(userId: string): Promise<any[]> {
    const payments = await this.prisma.paymentTransaction.findMany({
      where: { customerPhone: userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return payments.map((payment) => ({
      transactionId: payment.id,
      provider: payment.provider,
      amount: payment.amount,
      status: payment.status,
      createdAt: payment.createdAt,
      orderId: payment.orderId,
      metadata: payment.metadata,
    }));
  }
}
