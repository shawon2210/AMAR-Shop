import { IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSellerDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  commission?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  commissionRate?: number;
}
