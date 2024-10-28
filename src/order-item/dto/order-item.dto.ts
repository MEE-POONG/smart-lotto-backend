import { IsInt, IsOptional, IsDecimal, IsString } from 'class-validator';

export class OrderItemDto {
  @IsInt()
  order_id: number;

  @IsString()
  number_value: string;

  @IsInt()
  item_type_id: number;

  @IsInt()
  quantity: number;

  @IsDecimal()
  price: number;

  @IsInt()
  enterprise_id: number;

  @IsInt()
  @IsOptional()
  last_modified_by?: number;
}
