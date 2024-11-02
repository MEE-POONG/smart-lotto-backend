// dto/lottery.dto.ts
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

export class LotteryDto {
  @IsString()
  lottery_name: string;

  @IsDate()
  draw_date: Date;

  @IsString()
  @IsOptional()
  status?: string;

  @IsInt()
  enterprise_id: number;

  @IsInt()
  @IsOptional()
  last_modified_by?: number;

  @IsInt()
  @IsOptional()
  userUser_id?: number;
}
