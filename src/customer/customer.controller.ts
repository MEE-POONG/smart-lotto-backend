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
  async getCustomerById(@Param('id') id: number) {
    const customer = await this.customerService.findCustomerById(Number(id));
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  // Create a new customer
  @Post()
  async createCustomer(
    @Body() customerData: { name: string; code: string; email: string },
    @Body('userId') userId: number,
    @Body('enterpriseId') enterpriseId: number,
  ) {
    return this.customerService.createCustomer(
      customerData,
      Number(userId),
      Number(enterpriseId),
    );
  }

  // Update an existing customer
  @Put(':id')
  async updateCustomer(
    @Param('id') id: number,
    @Body() customerData: { name?: string; email?: string },
    @Body('userId') userId: number,
    @Body('enterpriseId') enterpriseId: number,
  ) {
    const updatedCustomer = await this.customerService.updateCustomer(
      Number(id),
      customerData,
      Number(userId),
      Number(enterpriseId),
    );
    if (!updatedCustomer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return updatedCustomer;
  }

  // Delete a customer by ID
  @Delete(':id')
  async deleteCustomer(
    @Param('id') id: number,
    @Body('userId') userId: number,
    @Body('enterpriseId') enterpriseId: number,
  ) {
    const success = await this.customerService.deleteCustomer(
      Number(id),
      Number(userId),
      Number(enterpriseId),
    );
    if (!success) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return { message: 'Customer deleted successfully' };
  }
}
