import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find a customer by their ID.
   * @param customerId - The unique ID of the customer.
   * @returns The customer data if found, or null if not found.
   */
  async findCustomerById(customerId: number) {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { customer_id: customerId },
      });

      if (!customer) {
        throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
      }

      return customer;
    } catch (error) {
      throw new HttpException(
        `Failed to find customer: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Create a new customer.
   * @param data - Customer data including name, code, and email.
   * @param userId - The ID of the user creating the customer.
   * @param enterpriseId - The ID of the enterprise associated with the customer.
   * @returns The newly created customer data.
   */
  async createCustomer(
    data: { name: string; code: string; email: string },
    userId: number,
    enterpriseId: number,
  ) {
    try {
      const customer = await this.prisma.customer.create({
        data: {
          customer_name: data.name,
          customer_code: data.code,
          customer_email: data.email,
          enterprise_id: enterpriseId,
        },
      });

      // Log the creation in the ChangeLog
      await this.prisma.changeLog.create({
        data: {
          entity_name: 'Customer',
          action: 'create',
          entity_id: customer.customer_id,
          after_data: customer,
          user_id: userId,
          enterprise_id: enterpriseId,
        },
      });

      return customer;
    } catch (error) {
      throw new HttpException(
        `Failed to create customer: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update customer information.
   * @param customerId - The ID of the customer to update.
   * @param data - The new data to update (name, email).
   * @param userId - The ID of the user updating the customer.
   * @param enterpriseId - The ID of the enterprise associated with the customer.
   * @returns The updated customer data.
   */
  async updateCustomer(
    customerId: number,
    data: { name?: string; email?: string },
    userId: number,
    enterpriseId: number,
  ) {
    try {
      const beforeData = await this.prisma.customer.findUnique({
        where: { customer_id: customerId },
      });

      if (!beforeData) {
        throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
      }

      const updatedCustomer = await this.prisma.customer.update({
        where: { customer_id: customerId },
        data: {
          customer_name: data.name,
          customer_email: data.email,
        },
      });

      // Log the update in the ChangeLog
      await this.prisma.changeLog.create({
        data: {
          entity_name: 'Customer',
          action: 'update',
          entity_id: customerId,
          before_data: beforeData,
          after_data: updatedCustomer,
          user_id: userId,
          enterprise_id: enterpriseId,
        },
      });

      return updatedCustomer;
    } catch (error) {
      throw new HttpException(
        `Failed to update customer: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Delete a customer.
   * @param customerId - The ID of the customer to delete.
   * @param userId - The ID of the user deleting the customer.
   * @param enterpriseId - The ID of the enterprise associated with the customer.
   * @returns A boolean indicating if the customer was successfully deleted.
   */
  async deleteCustomer(
    customerId: number,
    userId: number,
    enterpriseId: number,
  ) {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: { customer_id: customerId },
      });

      if (!customer) {
        throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
      }

      await this.prisma.customer.delete({
        where: { customer_id: customerId },
      });

      // Log the deletion in the ChangeLog
      await this.prisma.changeLog.create({
        data: {
          entity_name: 'Customer',
          action: 'delete',
          entity_id: customerId,
          before_data: customer,
          user_id: userId,
          enterprise_id: enterpriseId,
        },
      });

      return true;
    } catch (error) {
      throw new HttpException(
        `Failed to delete customer: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
