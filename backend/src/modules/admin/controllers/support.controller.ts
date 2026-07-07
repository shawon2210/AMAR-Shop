import {
  Controller, Get, Post, Put, Delete, Param, Query, Body, Request, UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AdminSupportService } from '../services/support.service';
import { ReplyTicketDto, UpdateTicketDto, UpdateReviewDto } from '../dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminSupportController {
  constructor(private readonly supportService: AdminSupportService) {}

  @Get('support-tickets')
  async getSupportTickets(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.supportService.getSupportTickets({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status, priority,
    });
  }

  @Get('support-tickets/:id')
  async getSupportTicket(@Param('id') id: string) {
    return this.supportService.getSupportTicket(id);
  }

  @Post('support-tickets/:id/reply')
  async replyToTicket(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: ReplyTicketDto,
  ) {
    return this.supportService.replyToTicket(id, req.user.id, dto.content);
  }

  @Put('support-tickets/:id')
  async updateSupportTicket(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.supportService.updateSupportTicket(id, dto);
  }

  @Get('reviews')
  async getReviews(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.supportService.getReviews({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      status,
    });
  }

  @Put('reviews/:id')
  async updateReview(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.supportService.updateReview(id, dto);
  }

  @Delete('reviews/:id')
  async deleteReview(@Param('id') id: string) {
    return this.supportService.deleteReview(id);
  }
}
