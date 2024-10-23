import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  NotFoundException,
  BadRequestException,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('customers')
@UseGuards(JwtAuthGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  /**
   * Fetch all customers.
   * @returns A list of all customers.
   */
  @Get()
  async getAllCustomers() {
    return this.customerService.findAll();
  }

  /**
   * Fetch a customer by ID
   * @param id - The customer ID passed as a route parameter
   * @returns The customer data if found, throws NotFoundException if not
   */
  @Get(':id')
  async getCustomerById(@Param('id', ParseIntPipe) id: number) {
    const customer = await this.customerService.findCustomerById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  /**
   * Create a new customer
   * @param customerData - The customer data passed in the request body
   * @param userId - The user ID passed in the request body
   * @param enterpriseId - The enterprise ID passed in the request body
   * @returns The created customer data
   */
  @Post()
  async createCustomer(
    @Body() customerData: { name: string; code: string; email: string },
    @Body('userId', ParseIntPipe) userId: number,
    @Body('enterpriseId', ParseIntPipe) enterpriseId: number,
  ) {
    if (!customerData.name || !customerData.code || !customerData.email) {
      throw new BadRequestException('Missing required customer data');
    }

    return this.customerService.createCustomer(
      customerData,
      userId,
      enterpriseId,
    );
  }

  /**
   * Update an existing customer
   * @param id - The customer ID passed as a route parameter
   * @param customerData - The customer data to update, passed in the request body
   * @param userId - The user ID passed in the request body
   * @param enterpriseId - The enterprise ID passed in the request body
   * @returns The updated customer data if found, throws NotFoundException if not
   */
  @Put(':id')
  async updateCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body() customerData: { name?: string; email?: string },
    @Body('userId', ParseIntPipe) userId: number,
    @Body('enterpriseId', ParseIntPipe) enterpriseId: number,
  ) {
    if (!customerData.name && !customerData.email) {
      throw new BadRequestException('Nothing to update');
    }

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

  /**
   * Delete a customer by ID
   * @param id - The customer ID passed as a route parameter
   * @param userId - The user ID passed in the request body
   * @param enterpriseId - The enterprise ID passed in the request body
   * @returns Success message if deleted, throws NotFoundException if not
   */
  @Delete(':id')
  async deleteCustomer(
    @Param('id', ParseIntPipe) id: number,
    @Body('userId', ParseIntPipe) userId: number,
    @Body('enterpriseId', ParseIntPipe) enterpriseId: number,
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
