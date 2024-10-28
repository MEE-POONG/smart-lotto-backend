import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemService } from './order-item.service';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

describe('OrderItemService', () => {
  let service: OrderItemService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderItemService, PrismaService],
    }).compile();

    service = module.get<OrderItemService>(OrderItemService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should create an order item', async () => {
    const mockOrderItem = {
      order_item_id: 1,
      order_id: 1,
      number_value: '123',
      item_type_id: 1,
      quantity: 1,
      price: new Decimal(100.0),
      enterprise_id: 1,
      last_modified_by: null,
    };
    jest
      .spyOn(prismaService.orderItem, 'create')
      .mockResolvedValue(mockOrderItem);

    expect(
      await service.create({
        order_id: 1,
        number_value: '123',
        item_type_id: 1,
        quantity: 1,
        price: 100.0,
        enterprise_id: 1,
      }),
    ).toEqual(mockOrderItem);
  });

  it('should find one order item', async () => {
    const mockOrderItem = {
      order_item_id: 1,
      order_id: 1,
      number_value: '123',
      item_type_id: 1,
      quantity: 1,
      price: new Decimal(100.0),
      enterprise_id: 1,
      last_modified_by: null,
    };
    jest
      .spyOn(prismaService.orderItem, 'findUnique')
      .mockResolvedValue(mockOrderItem);

    expect(await service.findOne(1)).toEqual(mockOrderItem);
  });

  it('should update an order item', async () => {
    const mockUpdatedItem = {
      order_item_id: 1,
      order_id: 1,
      number_value: '456',
      item_type_id: 1,
      quantity: 2,
      price: new Decimal(200.0),
      enterprise_id: 1,
      last_modified_by: null,
    };
    // Add findUnique mock to verify item exists
    jest
      .spyOn(prismaService.orderItem, 'findUnique')
      .mockResolvedValue(mockUpdatedItem);
    jest
      .spyOn(prismaService.orderItem, 'update')
      .mockResolvedValue(mockUpdatedItem);

    expect(
      await service.update(1, {
        order_id: 1,
        number_value: '456',
        item_type_id: 1,
        quantity: 2,
        price: 200.0,
        enterprise_id: 1,
      }),
    ).toEqual(mockUpdatedItem);
  });

  it('should remove an order item', async () => {
    const mockDeletedItem = {
      order_item_id: 1,
      order_id: 1,
      number_value: '123',
      item_type_id: 1,
      quantity: 1,
      price: new Decimal(100.0),
      enterprise_id: 1,
      last_modified_by: null,
    };
    // Add findUnique mock to verify item exists
    jest
      .spyOn(prismaService.orderItem, 'findUnique')
      .mockResolvedValue(mockDeletedItem);
    jest
      .spyOn(prismaService.orderItem, 'delete')
      .mockResolvedValue(mockDeletedItem);

    expect(await service.remove(1)).toEqual(mockDeletedItem);
  });

  // Add tests for findOne, update, and remove
});
