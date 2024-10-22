import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CustomerService } from './customer.service';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  // Fetch a customer by ID
  @Get(':id')
  async getCustomerById(@Param('id') id: string) {
    const customer = await this.customerService.findCustomerById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  // Create a new customer
  @Post()
  async createCustomer(
    @Body() customerData: { name: string; code: string, email: string },
    @Body('userId') userId: string,
    @Body('enterpriseId') enterpriseId: string,
  ) {
    return this.customerService.createCustomer(
      customerData,
      userId,
      enterpriseId,
    );
  }

  // Update an existing customer
  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() customerData: { name?: string; email?: string },
    @Body('userId') userId: string,
    @Body('enterpriseId') enterpriseId: string,
  ) {
    const updatedCustomer = await this.customerService.updateCustomer(
      id,
      customerData,
      userId,
      enterpriseId,
    );
    if (!updatedCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return updatedCustomer;
  }

  // Delete a customer by ID
  @Delete(':id')
  async deleteCustomer(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Body('enterpriseId') enterpriseId: string,
  ) {
    const success = await this.customerService.deleteCustomer(
      id,
      userId,
      enterpriseId,
    );
    if (!success) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return { message: 'Customer deleted successfully' };
  }
}
