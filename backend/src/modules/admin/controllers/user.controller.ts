import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { AdminUserService } from '../services/user.service';
import { UpdateUserDto, CreateAdminUserDto } from '../dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminUserController {
  constructor(private readonly userService: AdminUserService) {}

  @Get('users')
  async getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('role') role?: string,
  ) {
    return this.userService.getUsers({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
      search,
      role,
    });
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(id, dto);
  }

  @Post('users')
  async createAdminUser(@Body() dto: CreateAdminUserDto) {
    return this.userService.createAdminUser(dto);
  }

  @Get('creators')
  async getAdminCreators(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.userService.getAdminCreators({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 20,
    });
  }

  @Put('creators/:id')
  async updateAdminCreator(
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
  ) {
    return this.userService.updateAdminCreator(id, body);
  }
}
