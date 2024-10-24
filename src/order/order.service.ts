import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  // Create a new order
  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: number,
    enterpriseId: number,
  ) {
    try {
      const order = await this.prisma.order.create({
        data: {
          ...createOrderDto,
          total_price: new Decimal(createOrderDto.total_price),
          enterprise_id: Number(userId),
          last_modified_by: Number(enterpriseId),
        },
      });

      await this.prisma.changeLog.create({
        data: {
          entity_name: 'Order',
          action: 'create',
          entity_id: order.order_id,
          after_data: order,
          user_id: enterpriseId,
          enterprise_id: userId,
        },
      });

      return order;
    } catch (error) {
      throw new Error(`Failed to create order: ${error.message}`);
    }
  }

  // Find all orders
  async findAllOrders() {
    try {
      return await this.prisma.order.findMany();
    } catch (error) {
      throw new Error(`Failed to retrieve orders: ${error.message}`);
    }
  }

  // Find order by ID
  async findOrderById(orderId: number) {
    try {
      return await this.prisma.order.findUnique({
        where: { order_id: orderId },
      });
    } catch (error) {
      throw new Error(`Failed to retrieve order: ${error.message}`);
    }
  }

  // Update order
  async updateOrder(
    orderId: number,
    updateOrderDto: UpdateOrderDto,
    userId: number,
    enterpriseId: number,
  ) {
    try {
      const beforeData = await this.prisma.order.findUnique({
        where: { order_id: orderId },
      });

      const updatedOrder = await this.prisma.order.update({
        where: { order_id: orderId },
        data: {
          ...updateOrderDto,
          total_price: new Decimal(updateOrderDto.total_price),
          last_modified_by: userId,
        },
      });

      await this.prisma.changeLog.create({
        data: {
          entity_name: 'Order',
          action: 'update',
          entity_id: orderId,
          before_data: beforeData,
          after_data: updatedOrder,
          user_id: userId,
          enterprise_id: enterpriseId,
        },
      });

      return updatedOrder;
    } catch (error) {
      throw new Error(`Failed to update order: ${error.message}`);
    }
  }

  // Delete order
  async deleteOrder(orderId: number, userId: number, enterpriseId: number) {
    try {
      const beforeData = await this.prisma.order.findUnique({
        where: { order_id: orderId },
      });

      await this.prisma.order.delete({
        where: { order_id: orderId },
      });

      await this.prisma.changeLog.create({
        data: {
          entity_name: 'Order',
          action: 'delete',
          entity_id: orderId,
          before_data: beforeData,
          user_id: userId,
          enterprise_id: enterpriseId,
        },
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to delete order: ${error.message}`);
    }
  }
}
