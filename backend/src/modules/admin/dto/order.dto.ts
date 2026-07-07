import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}

export class AddOrderNoteDto {
  @IsString()
  @IsNotEmpty()
  note: string;
}
