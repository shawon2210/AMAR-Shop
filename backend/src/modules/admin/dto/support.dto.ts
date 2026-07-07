import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class ReplyTicketDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class UpdateTicketDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  priority?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;
}
