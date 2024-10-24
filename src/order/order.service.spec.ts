import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.dto';
import { Decimal } from '@prisma/client/runtime/library';

describe('OrderService', () => {
  let service: OrderService;
  let prisma: PrismaService;

  const mockPrismaService = {
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    changeLog: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a new order', async () => {
    const createOrderDto: CreateOrderDto = {
      customer_id: 1,
      total_price: new Decimal(1000),
      order_status: 'Pending',
      payment_status: 'Paid',
      enterprise_id: 1,
    };

    const mockOrder = {
      order_id: 1,
      ...createOrderDto,
      order_date: new Date(),
      pay_slip_image: '',
      last_modified_by: 1,
    };
    const orderData = {
      ...createOrderDto,
      order_id: 1,
      order_date: new Date(),
      pay_slip_image: '',
      last_modified_by: 1,
    };
    jest.spyOn(prisma.order, 'create').mockResolvedValue(orderData);
    jest.spyOn(prisma.changeLog, 'create').mockResolvedValue(null);

    const result = await service.createOrder(createOrderDto, 1, 1);

    expect(result).toEqual(mockOrder);
    expect(prisma.order.create).toHaveBeenCalledWith({
      data: {
        ...createOrderDto,
        enterprise_id: 1,
        last_modified_by: 1,
      },
    });
    expect(prisma.changeLog.create).toHaveBeenCalledWith({
      data: {
        entity_name: 'Order',
        action: 'create',
        entity_id: mockOrder.order_id,
        after_data: mockOrder,
        user_id: 1,
        enterprise_id: 1,
      },
    });
  });

  it('should retrieve all orders', async () => {
    const mockOrders = [
      {
        order_id: 1,
        customer_id: 1,
        total_price: new Decimal(1000), // Ensure the total_price is a Decimal
        order_status: 'Pending',
        payment_status: 'Paid',
        enterprise_id: 1,
        order_date: new Date(),
        pay_slip_image: '',
        last_modified_by: 1,
      },
    ];

    jest.spyOn(prisma.order, 'findMany').mockResolvedValue(mockOrders);

    const result = await service.findAllOrders();

    expect(result).toEqual(mockOrders);
    expect(prisma.order.findMany).toHaveBeenCalled();
  });

  it('should find an order by ID', async () => {
    const mockOrder = {
      order_id: 1,
      total_price: new Decimal(100), // Ensure total_price is a Decimal
      customer_id: 1,
      order_status: 'Pending',
      payment_status: 'Paid',
      enterprise_id: 1,
      order_date: new Date(),
      pay_slip_image: '',
      last_modified_by: 1,
    };

    jest.spyOn(prisma.order, 'findUnique').mockResolvedValue(mockOrder);

    const result = await service.findOrderById(1);

    expect(result).toEqual(mockOrder);
    expect(prisma.order.findUnique).toHaveBeenCalledWith({
      where: { order_id: 1 },
    });
  });

  it('should update an order', async () => {
    const updateOrderDto: UpdateOrderDto = {
      total_price: new Decimal(150), // Use Decimal for the updated price
      enterprise_id: 1,
    };

    const mockBeforeOrder = {
      order_id: 1,
      total_price: new Decimal(100), // Ensure total_price is a Decimal
      customer_id: 1,
      order_status: 'Pending',
      payment_status: 'Paid',
      enterprise_id: 1,
      order_date: new Date(),
      pay_slip_image: '',
      last_modified_by: 1,
    }; // Before update
    const mockUpdatedOrder = {
      order_id: 1,
      total_price: new Decimal(150), // Ensure total_price is a Decimal
      customer_id: 1,
      order_status: 'Pending',
      payment_status: 'Paid',
      enterprise_id: 1,
      order_date: new Date(),
      pay_slip_image: '',
      last_modified_by: 1,
    }; // After update

    // Mock findUnique to return the order before the update
    jest.spyOn(prisma.order, 'findUnique').mockResolvedValue(mockBeforeOrder);
    // Mock update to return the updated order
    jest.spyOn(prisma.order, 'update').mockResolvedValue(mockUpdatedOrder);
    // Mock changeLog.create to return null (or anything, as it is not the focus here)
    jest.spyOn(prisma.changeLog, 'create').mockResolvedValue(null);

    const result = await service.updateOrder(1, updateOrderDto, 1, 1);

    // Expect the result to be the updated order
    expect(result).toEqual(mockUpdatedOrder);

    // Verify that prisma.order.update is called with the correct arguments
    expect(prisma.order.update).toHaveBeenCalledWith({
      where: { order_id: 1 },
      data: {
        ...updateOrderDto,
        last_modified_by: 1,
      },
    });

    // Verify that the change log is created with the correct data
    expect(prisma.changeLog.create).toHaveBeenCalledWith({
      data: {
        entity_name: 'Order',
        action: 'update',
        entity_id: 1,
        before_data: mockBeforeOrder, // Before data
        after_data: mockUpdatedOrder, // After data
        user_id: 1,
        enterprise_id: 1,
      },
    });
  });
  it('should delete an order', async () => {
    const mockBeforeOrder = {
      order_id: 1,
      total_price: new Decimal(100), // Ensure total_price is a Decimal
      customer_id: 1,
      order_status: 'Pending',
      payment_status: 'Paid',
      enterprise_id: 1,
      order_date: new Date(),
      pay_slip_image: '',
      last_modified_by: 1,
    }; // Before delete

    // Mock findUnique to return the order before the deletion
    jest.spyOn(prisma.order, 'findUnique').mockResolvedValue(mockBeforeOrder);
    // Mock delete to simulate the order deletion
    jest.spyOn(prisma.order, 'delete').mockResolvedValue(mockBeforeOrder); // Could also return the deleted order object
    // Mock changeLog.create to return null (or anything, as it is not the focus here)
    jest.spyOn(prisma.changeLog, 'create').mockResolvedValue(null);

    const result = await service.deleteOrder(1, 1, 1);

    // Expect the service to return true after deletion
    expect(result).toBe(true);

    // Ensure the correct delete call was made
    expect(prisma.order.delete).toHaveBeenCalledWith({
      where: { order_id: 1 },
    });

    // Ensure the change log is created with the correct data
    expect(prisma.changeLog.create).toHaveBeenCalledWith({
      data: {
        entity_name: 'Order',
        action: 'delete',
        entity_id: 1,
        before_data: mockBeforeOrder, // Log the data before deletion
        user_id: 1,
        enterprise_id: 1,
      },
    });
  });
});
