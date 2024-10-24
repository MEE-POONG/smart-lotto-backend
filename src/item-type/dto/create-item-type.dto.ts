import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateItemTypeDto {
  @IsString()
  @IsNotEmpty()
  type_name: string;

  @IsInt()
  @IsNotEmpty()
  enterprise_id: number;

  @IsInt()
  @IsNotEmpty()
  user_id: number;
}
