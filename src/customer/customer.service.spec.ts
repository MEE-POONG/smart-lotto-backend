import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('CustomerService', () => {
  let service: CustomerService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomerService, PrismaService],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('findCustomerById', () => {
    it('should return customer data if found', async () => {
      const mockCustomer = { customer_id: 1, customer_name: 'John Doe' };
      prisma.customer.findUnique = jest.fn().mockResolvedValue(mockCustomer);

      const result = await service.findCustomerById(1);
      expect(result).toEqual(mockCustomer);
    });

    it('should throw a 404 error if Failed to find customer: Customer not found', async () => {
      prisma.customer.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.findCustomerById(1)).rejects.toThrow(
        new HttpException('Failed to find customer: Customer not found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('createCustomer', () => {
    it('should create a customer and log the creation', async () => {
      const mockCustomer = {
        customer_id: 1,
        customer_name: 'John Doe',
        customer_code: 'CUST001',
        customer_email: 'john@example.com',
      };
      const mockLog = {
        entity_name: 'Customer',
        action: 'create',
        entity_id: 1,
      };

      prisma.customer.create = jest.fn().mockResolvedValue(mockCustomer);
      prisma.changeLog.create = jest.fn().mockResolvedValue(mockLog);

      const result = await service.createCustomer(
        { name: 'John Doe', code: 'CUST001', email: 'john@example.com' },
        1,
        1,
      );
      expect(result).toEqual(mockCustomer);
      expect(prisma.customer.create).toHaveBeenCalled();
      expect(prisma.changeLog.create).toHaveBeenCalled();
    });

    it('should throw an error if customer creation fails', async () => {
      prisma.customer.create = jest
        .fn()
        .mockRejectedValue(new Error('Database Error'));

      await expect(
        service.createCustomer(
          { name: 'John Doe', code: 'CUST001', email: 'john@example.com' },
          1,
          1,
        ),
      ).rejects.toThrow(
        new HttpException(
          'Failed to create customer: Database Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('updateCustomer', () => {
    it('should update a customer and log the update', async () => {
      const mockCustomer = {
        customer_id: 1,
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
      };
      const mockLog = {
        entity_name: 'Customer',
        action: 'update',
        entity_id: 1,
      };

      prisma.customer.findUnique = jest.fn().mockResolvedValue(mockCustomer);
      prisma.customer.update = jest.fn().mockResolvedValue(mockCustomer);
      prisma.changeLog.create = jest.fn().mockResolvedValue(mockLog);

      const result = await service.updateCustomer(
        1,
        { name: 'John Doe' },
        1,
        1,
      );
      expect(result).toEqual(mockCustomer);
      expect(prisma.customer.update).toHaveBeenCalled();
      expect(prisma.changeLog.create).toHaveBeenCalled();
    });

    it('should throw an error if customer is not found', async () => {
      prisma.customer.findUnique = jest.fn().mockResolvedValue(null);

      await expect(
        service.updateCustomer(1, { name: 'John Doe' }, 1, 1),
      ).rejects.toThrow(
        new HttpException('Failed to update customer: Customer not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if customer update fails', async () => {
      prisma.customer.findUnique = jest
        .fn()
        .mockResolvedValue({ customer_id: 1 });
      prisma.customer.update = jest
        .fn()
        .mockRejectedValue(new Error('Database Error'));

      await expect(
        service.updateCustomer(1, { name: 'John Doe' }, 1, 1),
      ).rejects.toThrow(
        new HttpException(
          'Failed to update customer: Database Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });

  describe('deleteCustomer', () => {
    it('should delete a customer and log the deletion', async () => {
      const mockCustomer = { customer_id: 1, customer_name: 'John Doe' };
      const mockLog = {
        entity_name: 'Customer',
        action: 'delete',
        entity_id: 1,
      };

      prisma.customer.findUnique = jest.fn().mockResolvedValue(mockCustomer);
      prisma.customer.delete = jest.fn().mockResolvedValue(mockCustomer);
      prisma.changeLog.create = jest.fn().mockResolvedValue(mockLog);

      const result = await service.deleteCustomer(1, 1, 1);
      expect(result).toEqual(true);
      expect(prisma.customer.delete).toHaveBeenCalled();
      expect(prisma.changeLog.create).toHaveBeenCalled();
    });

    it('should throw an error if customer is not found', async () => {
      prisma.customer.findUnique = jest.fn().mockResolvedValue(null);

      await expect(service.deleteCustomer(1, 1, 1)).rejects.toThrow(
        new HttpException('Failed to delete customer: Customer not found', HttpStatus.NOT_FOUND),
      );
    });

    it('should throw an error if customer deletion fails', async () => {
      prisma.customer.findUnique = jest
        .fn()
        .mockResolvedValue({ customer_id: 1 });
      prisma.customer.delete = jest
        .fn()
        .mockRejectedValue(new Error('Database Error'));

      await expect(service.deleteCustomer(1, 1, 1)).rejects.toThrow(
        new HttpException(
          'Failed to delete customer: Database Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        ),
      );
    });
  });
});
