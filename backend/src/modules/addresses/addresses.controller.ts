import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AddressesService } from './addresses.service';

@UseGuards(AuthGuard('jwt'))
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  async findByUser(@Request() req: any) {
    return this.addressesService.findByUser(req.user.id);
  }

  @Post()
  async create(
    @Request() req: any,
    @Body()
    body: {
      label?: string;
      fullName: string;
      phone: string;
      street: string;
      city: string;
      area?: string;
    },
  ) {
    return this.addressesService.create(req.user.id, body);
  }
}
