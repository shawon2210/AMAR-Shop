import { IsOptional, IsString } from 'class-validator';

export class UpdateAffiliateDto {
  @IsOptional()
  @IsString()
  status?: string;
}
