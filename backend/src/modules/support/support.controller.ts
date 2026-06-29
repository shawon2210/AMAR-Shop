import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SupportService } from './support.service';

@UseGuards(AuthGuard('jwt'))
@Controller('api/support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('tickets')
  async createTicket(@Request() req: any, @Body() body: any) {
    return this.supportService.createTicket(req.user.id, body);
  }

  @Get('tickets')
  async getTickets(
    @Request() req: any,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.supportService.getTickets(req.user.id, {
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
    });
  }

  @Post('tickets/:id/reply')
  async replyTicket(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { content: string; attachments?: string[] },
  ) {
    return this.supportService.replyTicket(id, req.user.id, body);
  }

  @Put('tickets/:id/close')
  async closeTicket(@Param('id') id: string) {
    return this.supportService.closeTicket(id);
  }

  @Get('faqs')
  async getFAQs(@Query('category') category?: string) {
    return this.supportService.getFAQs(category);
  }
}
