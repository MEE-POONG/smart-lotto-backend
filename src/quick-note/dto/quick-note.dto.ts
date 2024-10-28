import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class QuickNoteDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  note_description: string;

  @IsInt()
  order_id: number;

  @IsInt()
  enterprise_id: number;

  @IsInt()
  @IsOptional()
  last_modified_by?: number;
}
