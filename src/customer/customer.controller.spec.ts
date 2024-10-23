import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { NotFoundException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            createCustomer: jest.fn(), // Mocking the createCustomer method
            updateCustomer: jest.fn(), // Mocking the updateCustomer method
            deleteCustomer: jest.fn(), // Mocking the deleteCustomer method
            findCustomerById: jest.fn(), // Mocking the findCustomerById method
            findAll: jest.fn().mockResolvedValue([]), // Mock your service methods
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Mock the JwtAuthGuard
      .useValue({ canActivate: () => true }) // Always allow
      .compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getCustomer', () => {
    it('should return a customer', async () => {
      const mockCustomer = [
        {
          customer_id: 1,
          customer_name: 'John Doe',
          customer_code: 'JD123',
          customer_email: 'john@example.com',
          customer_phone: '1234567890',
          customer_address: '123 Main St',
          bank_name: 'Bank ABC',
          bank_account_no: '1234567890',
          bank_account_type: 'Savings',
          enterprise_id: 1,
          last_modified_by: 1,
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockCustomer);

      const result = await controller.getAllCustomers();
      expect(result).toEqual(mockCustomer);
      expect(service.findAll).toHaveBeenCalledWith();
    });

    it('should throw a NotFoundException if customer is not found', async () => {
      jest.spyOn(service, 'findCustomerById').mockResolvedValue(null);

      await expect(controller.getCustomerById(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findCustomerById).toHaveBeenCalledWith(1);
    });
  });

  describe('getCustomerById', () => {
    it('should return a customer by ID', async () => {
      const mockCustomer = {
        customer_id: 1,
        customer_name: 'John Doe',
        customer_code: 'JD123',
        customer_email: 'john@example.com',
        customer_phone: '1234567890',
        customer_address: '123 Main St',
        bank_name: 'Bank ABC',
        bank_account_no: '1234567890',
        bank_account_type: 'Savings',
        enterprise_id: 1,
        last_modified_by: 1,
      };
      jest.spyOn(service, 'findCustomerById').mockResolvedValue(mockCustomer);

      const result = await controller.getCustomerById(1);
      expect(result).toEqual(mockCustomer);
      expect(service.findCustomerById).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if customer is not found', async () => {
      jest.spyOn(service, 'findCustomerById').mockResolvedValue(null);

      await expect(controller.getCustomerById(1)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findCustomerById).toHaveBeenCalledWith(1);
    });
  });

  describe('createCustomer', () => {
    it('should create a new customer', async () => {
      const mockCustomer = {
        customer_id: 1,
        customer_name: 'John Doe',
        customer_code: 'JD123',
        customer_email: 'john@example.com',
        customer_phone: '1234567890',
        customer_address: '123 Main St',
        bank_name: 'Bank ABC',
        bank_account_no: '1234567890',
        bank_account_type: 'Savings',
        enterprise_id: 1,
        last_modified_by: 1,
      };
      jest.spyOn(service, 'createCustomer').mockResolvedValue(mockCustomer);

      const customerData = {
        name: 'John Doe',
        code: 'JD123',
        email: 'john@example.com',
      };
      const result = await controller.createCustomer(customerData, 1, 1);

      expect(result).toEqual(mockCustomer);
      expect(service.createCustomer).toHaveBeenCalledWith(customerData, 1, 1);
    });
  });

  describe('updateCustomer', () => {
    it('should update a customer', async () => {
      const mockUpdatedCustomer = {
        customer_id: 1,
        customer_name: 'John Smith',
        customer_code: 'JS123',
        customer_email: 'johnsmith@example.com',
        customer_phone: '9876543210',
        customer_address: '456 Another St',
        bank_name: 'Bank XYZ',
        bank_account_no: '9876543210',
        bank_account_type: 'Checking',
        enterprise_id: 2,
        last_modified_by: 1,
      };
      jest
        .spyOn(service, 'updateCustomer')
        .mockResolvedValue(mockUpdatedCustomer);

      const updateData = {
        name: 'John Smith',
        code: 'JS123',
        email: 'johnsmith@example.com',
      };
      const result = await controller.updateCustomer(1, updateData, 1, 1);

      expect(result).toEqual(mockUpdatedCustomer);
      expect(service.updateCustomer).toHaveBeenCalledWith(1, updateData, 1, 1);
    });
  });

  describe('deleteCustomer', () => {
    it('should delete a customer', async () => {
      jest.spyOn(service, 'deleteCustomer').mockResolvedValue(true);

      const result = await controller.deleteCustomer(1, 1, 1);

      expect(result).toEqual({ message: 'Customer deleted successfully' });
      expect(service.deleteCustomer).toHaveBeenCalledWith(1, 1, 1);
    });
  });
});
