import { IsOptional, IsBoolean, IsString } from 'class-validator';

export class UpdateReviewDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  reported?: boolean;
}
