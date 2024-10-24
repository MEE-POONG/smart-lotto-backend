import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Put,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: User) {
    console.log("user: ", user.user_id, user.enterprise_id);
    
    return this.orderService.createOrder(createOrderDto, user.user_id, user.enterprise_id); // Example user and enterprise IDs
  }

  @Get()
  async findAll() {
    return this.orderService.findAllOrders();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const order = await this.orderService.findOrderById(Number(id));
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateOrderDto: UpdateOrderDto,
    @GetUser() user: User
  ) {
    return this.orderService.updateOrder(Number(id), updateOrderDto, user.user_id, user.enterprise_id);
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @GetUser() user: User) {
    return this.orderService.deleteOrder(Number(id), user.user_id, user.enterprise_id);
  }
}
