import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: PrismaService,
          useValue: {
            customer: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            changeLog: {
              create: jest.fn(), // Mock changeLog.create
            },
          },
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findCustomerById', () => {
    it('should return a customer if found', async () => {
      const mockCustomer = {
        customer_id: '1',
        customer_name: 'John Doe',
        customer_code: 'JD123',
        customer_email: 'john@example.com',
        customer_phone: '1234567890',
        customer_address: '123 Main St',
        bank_name: 'Bank ABC',
        bank_account_no: '1234567890',
        bank_account_type: 'Savings',
        enterprise_id: 'enterprise123',
        last_modified_by: 'admin',
      };
      jest.spyOn(prisma.customer, 'findUnique').mockResolvedValue(mockCustomer);

      const result = await service.findCustomerById('1');
      expect(result).toEqual(mockCustomer);
      expect(prisma.customer.findUnique).toHaveBeenCalledWith({
        where: { customer_id: '1' },
      });
    });

    it('should return null if customer is not found', async () => {
      jest.spyOn(prisma.customer, 'findUnique').mockResolvedValue(null);

      const result = await service.findCustomerById('1');
      expect(result).toBeNull();
      expect(prisma.customer.findUnique).toHaveBeenCalledWith({
        where: { customer_id: '1' },
      });
    });
  });

  describe('createCustomer', () => {
    it('should create and return a new customer', async () => {
      const mockCustomer = {
        customer_id: '1',
        customer_name: 'John Doe',
        customer_code: 'JD123',
        customer_email: 'john@example.com',
        customer_phone: '1234567890',
        customer_address: '123 Main St',
        bank_name: 'Bank ABC',
        bank_account_no: '1234567890',
        bank_account_type: 'Savings',
        enterprise_id: 'enterprise123',
        last_modified_by: 'admin',
      };
      jest.spyOn(prisma.customer, 'create').mockResolvedValue(mockCustomer);
      jest.spyOn(prisma.changeLog, 'create').mockResolvedValue({
        action: 'delete',
        after_data: mockCustomer,
        before_data: null,
        change_time: new Date(),
        enterprise_id: 'enterprise123',
        entity_id: '1',
        entity_name: 'Customer',
        user_id: 'user123',
        log_id: 1,
        last_modified_by: 'admin',
      }); // Mock the log creation

      const result = await service.createCustomer(
        { name: 'John Doe', code: 'JD123', email: 'john@example.com' },
        'user123',
        'enterprise123',
      );
      expect(result).toEqual(mockCustomer);
      expect(prisma.customer.create).toHaveBeenCalledWith({
        data: {
          customer_name: 'John Doe',
          customer_code: 'JD123', // Fixed the customer_code
          customer_email: 'john@example.com',
          enterprise_id: 'enterprise123',
        },
      });
    });
  });

  describe('updateCustomer', () => {
    it('should update and return an existing customer', async () => {
      const mockUpdatedCustomer = {
        customer_id: '1',
        customer_name: 'John Smith',
        customer_code: 'John Smith',
        customer_email: 'john@example.com',
        customer_phone: '1234567890',
        customer_address: '123 Main St',
        bank_name: 'Bank ABC',
        bank_account_no: '1234567890',
        bank_account_type: 'Savings',
        enterprise_id: 'enterprise123',
        last_modified_by: 'admin',
      };
      jest
        .spyOn(prisma.customer, 'update')
        .mockResolvedValue(mockUpdatedCustomer);

      jest.spyOn(prisma.changeLog, 'create').mockResolvedValue({
        action: 'delete',
        after_data: mockUpdatedCustomer,
        before_data: null,
        change_time: new Date(),
        enterprise_id: 'enterprise123',
        entity_id: '1',
        entity_name: 'Customer',
        user_id: 'user123',
        log_id: 1,
        last_modified_by: 'admin',
      }); // Mock the log creation

      const result = await service.updateCustomer(
        '1',
        { name: 'John Smith', email: 'john@example.com' },
        'user123',
        'enterprise123',
      );
      expect(result).toEqual(mockUpdatedCustomer);
      expect(prisma.customer.update).toHaveBeenCalledWith({
        where: { customer_id: '1' },
        data: {
          customer_name: 'John Smith',
          customer_email: 'john@example.com',
        },
      });
    });
  });
  describe('deleteCustomer', () => {
    it('should delete a customer and return true', async () => {
      const mockCustomer = {
        customer_id: '1',
        customer_name: 'John Doe',
        customer_code: 'JD123',
        customer_email: 'john@example.com',
        customer_phone: '1234567890',
        customer_address: '123 Main St',
        bank_name: 'Bank ABC',
        bank_account_no: '1234567890',
        bank_account_type: 'Savings',
        enterprise_id: 'enterprise123',
        last_modified_by: 'admin',
      };

      jest.spyOn(prisma.customer, 'delete').mockResolvedValue(mockCustomer);
      jest.spyOn(prisma.changeLog, 'create').mockResolvedValue({
        action: 'delete',
        after_data: mockCustomer,
        before_data: null,
        change_time: new Date(),
        enterprise_id: 'enterprise123',
        entity_id: '1',
        entity_name: 'Customer',
        user_id: 'user123',
        log_id: 1,
        last_modified_by: 'admin',
      }); // Mock the log creation

      const result = await service.deleteCustomer(
        '1',
        'user123',
        'enterprise123',
      );

      expect(result).toEqual(true);
      expect(prisma.customer.delete).toHaveBeenCalledWith({
        where: { customer_id: '1' },
      });
    });
  });
});
