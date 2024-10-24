import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { NotFoundException } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { Decimal } from '@prisma/client/runtime/library';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  const mockOrderService = {
    createOrder: jest.fn(),
    findAllOrders: jest.fn(),
    findOrderById: jest.fn(),
    updateOrder: jest.fn(),
    deleteOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: mockOrderService,
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should create an order', async () => {
    const createOrderDto: CreateOrderDto = {
      customer_id: 1,
      total_price: new Decimal(100), // Proper handling of Decimal
      order_status: 'Pending',
      payment_status: 'Paid',
      enterprise_id: 1,
    };

    const mockOrder = {
      order_id: 1,
      customer_id: 1,
      total_price: new Decimal(100), // Ensure mock order uses Decimal as well
      order_status: 'Pending',
      payment_status: 'Paid',
      enterprise_id: 1,
      order_date: new Date(), // Include any other necessary fields like order_date
      last_modified_by: 1,
      pay_slip_image: '',
    };

    const user: any = { user_id: 1, enterprise_id: 1 };

    // Mock the service's createOrder method to return the mockOrder
    jest.spyOn(service, 'createOrder').mockResolvedValue(mockOrder);

    // Call the controller's create method
    const result = await controller.create(createOrderDto, user);

    // Assert that the result matches the mock order
    expect(result).toEqual(mockOrder);

    // Ensure the service's createOrder method was called with the correct arguments
    expect(service.createOrder).toHaveBeenCalledWith(createOrderDto, 1, 1);
  });

  it('should return all orders', async () => {
    const mockOrders = [
      {
        order_id: 1,
        total_price: new Decimal(100),
        customer_id: 1,
        order_status: 'Pending',
        payment_status: 'Paid',
        enterprise_id: 1,
        order_date: new Date(),
        last_modified_by: 1,
        pay_slip_image: '',
      },
    ];

    jest.spyOn(service, 'findAllOrders').mockResolvedValue(mockOrders);

    const result = await controller.findAll();

    expect(result).toEqual(mockOrders);
    expect(service.findAllOrders).toHaveBeenCalled();
  });

  it('should return an order by ID', async () => {
    const mockOrder = {
      order_id: 1,
      total_price: new Decimal(100),
      customer_id: 1,
      order_status: 'Pending',
      payment_status: 'Paid',
      enterprise_id: 1,
      order_date: new Date(),
      last_modified_by: 1,
      pay_slip_image: '',
    };

    jest.spyOn(service, 'findOrderById').mockResolvedValue(mockOrder);

    const result = await controller.findOne(1);

    expect(result).toEqual(mockOrder);
    expect(service.findOrderById).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException if order is not found', async () => {
    jest.spyOn(service, 'findOrderById').mockResolvedValue(null);

    await expect(controller.findOne(1)).rejects.toThrow(
      new NotFoundException('Order with ID 1 not found'),
    );
  });

  it('should update an order', async () => {
    const updateOrderDto: UpdateOrderDto = {
      total_price: new Decimal(150),
      enterprise_id: 1,
    };

    const mockUpdatedOrder = {
      order_id: 1,
      total_price: new Decimal(150),
      customer_id: 1,
      order_status: 'Pending',
      payment_status: 'Paid',
      enterprise_id: 1,
      order_date: new Date(),
      last_modified_by: 1,
      pay_slip_image: '',
    };

    const user: any = { user_id: 1, enterprise_id: 1 };

    jest.spyOn(service, 'updateOrder').mockResolvedValue(mockUpdatedOrder);

    const result = await controller.update(1, updateOrderDto, user);

    expect(result).toEqual(mockUpdatedOrder);
    expect(service.updateOrder).toHaveBeenCalledWith(1, updateOrderDto, 1, 1);
  });

  it('should delete an order', async () => {
    jest.spyOn(service, 'deleteOrder').mockResolvedValue(true);

    const user: any = { user_id: 1, enterprise_id: 1 };

    const result = await controller.delete(1, user);

    expect(result).toBe(true);
    expect(service.deleteOrder).toHaveBeenCalledWith(1, 1, 1);
  });
});
