import {
  IsOptional,
  IsString,
  IsBoolean,
  IsEmail,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}

export class CreateAdminUserDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
