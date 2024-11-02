import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Assuming you're using Prisma as the ORM
import { OrderItemDto } from './dto/order-item.dto';
import { OrderItem } from '@prisma/client';

@Injectable()
export class OrderItemService {
  constructor(private prisma: PrismaService) {}

  async create(data: OrderItemDto): Promise<OrderItem> {
    try {
      return await this.prisma.orderItem.create({ data });
    } catch (error) {
      throw new Error(`Failed to create order item: ${error.message}`);
    }
  }

  async createMany(data: OrderItemDto[]): Promise<number> {
    try {
      const result = await this.prisma.orderItem.createMany({ data });
      return result.count;
    } catch (error) {
      throw new Error(`Failed to create order items: ${error.message}`);
    }
  }

  async findAll(): Promise<OrderItem[]> {
    return this.prisma.orderItem.findMany({
      include: {
        order: true,
        item_type: true,
      },
    });
  }

  async findOne(id: number): Promise<OrderItem> {
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid order item ID');
    }

    const orderItem = await this.prisma.orderItem.findUnique({
      where: { order_item_id: id },
    });
    if (!orderItem) throw new NotFoundException('Order item not found');
    return orderItem;
  }

  async update(id: number, data: OrderItemDto): Promise<OrderItem> {
    await this.findOne(id); // Verify existence first

    try {
      return await this.prisma.orderItem.update({
        where: { order_item_id: id },
        data,
      });
    } catch (error) {
      throw new Error(`Failed to update order item: ${error.message}`);
    }
  }

  async remove(id: number): Promise<OrderItem> {
    await this.findOne(id); // Verify existence first

    try {
      return await this.prisma.orderItem.delete({
        where: { order_item_id: id },
      });
    } catch (error) {
      throw new Error(`Failed to delete order item: ${error.message}`);
    }
  }
}
