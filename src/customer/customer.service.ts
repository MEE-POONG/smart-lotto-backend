import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  /**
   * Find a customer by their ID.
   * @param customerId - The unique ID of the customer.
   * @returns The customer data if found, or null if not found.
   */
  async findCustomerById(customerId: string) {
    return this.prisma.customer.findUnique({
      where: { customer_id: customerId }, // Assumes the ID field is 'customer_id' in the database
    });
  }

  async createCustomer(
    data: { name: string; code: string; email: string },
    userId: string,
    enterpriseId: string,
  ) {
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
        after_data: customer, // Record the new customer data
        user_id: userId,
        enterprise_id: enterpriseId,
      },
    });

    return customer;
  }

  async updateCustomer(
    customerId: string,
    data: { name?: string; email?: string },
    userId: string,
    enterpriseId: string,
  ) {
    // Fetch the current data before update
    const beforeData = await this.prisma.customer.findUnique({
      where: { customer_id: customerId },
    });

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
        before_data: beforeData, // Log the data before the change
        after_data: updatedCustomer, // Log the updated data
        user_id: userId,
        enterprise_id: enterpriseId,
      },
    });

    return updatedCustomer;
  }

  async deleteCustomer(
    customerId: string,
    userId: string,
    enterpriseId: string,
  ) {
    // Fetch the current data before delete
    const customer = await this.prisma.customer.findUnique({
      where: { customer_id: customerId },
    });

    await this.prisma.customer.delete({
      where: { customer_id: customerId },
    });

    // Log the deletion in the ChangeLog
    await this.prisma.changeLog.create({
      data: {
        entity_name: 'Customer',
        action: 'delete',
        entity_id: customerId,
        before_data: customer, // Record the data before deletion
        user_id: userId,
        enterprise_id: enterpriseId,
      },
    });

    return true;
  }
}
