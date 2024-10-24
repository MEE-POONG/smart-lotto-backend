import { Decimal } from '@prisma/client/runtime/library';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsDecimal,
  IsInt,
} from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  customer_id: number; // Foreign key for the customer placing the order

  @IsNotEmpty()
  @IsDecimal()
  total_price: Decimal; // Total price for the order

  @IsNotEmpty()
  @IsString()
  order_status: string; // Order status (e.g., Pending, Shipped, Delivered)

  @IsNotEmpty()
  @IsString()
  payment_status: string; // Payment status (e.g., Paid, Unpaid)

  @IsOptional()
  @IsString()
  pay_slip_image?: string; // Optional pay slip image link

  @IsNotEmpty()
  @IsNumber()
  enterprise_id: number; // Foreign key for the enterprise associated with the order
}

export class UpdateOrderDto {
  @IsOptional()
  @IsNumber()
  customer_id?: number;

  @IsOptional()
  @IsDecimal()
  total_price?: Decimal;

  @IsOptional()
  @IsString()
  order_status?: string;

  @IsOptional()
  @IsString()
  payment_status?: string;

  @IsOptional()
  @IsString()
  pay_slip_image?: string;

  @IsOptional()
  @IsNumber()
  enterprise_id?: number;
}
