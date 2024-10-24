import { IsString, IsOptional } from 'class-validator';

export class UpdateItemTypeDto {
  @IsString()
  @IsOptional()
  type_name?: string;
}
