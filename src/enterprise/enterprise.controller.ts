import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { EnterpriseService } from './enterprise.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Assuming you're using a JWT auth guard

@Controller('enterprises')
@UseGuards(JwtAuthGuard) // Apply JWT auth guard to protect these routes
export class EnterpriseController {
  constructor(private readonly enterpriseService: EnterpriseService) {}

  /**
   * Fetch all enterprises.
   * @returns A list of enterprises.
   */
  @Get()
  async getAllEnterprises() {
    try {
      return await this.enterpriseService.findAll();
    } catch (error) {
      throw new HttpException(
        `Failed to fetch enterprises: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Fetch an enterprise by ID.
   * @param id - The ID of the enterprise.
   * @returns The enterprise data.
   */
  @Get(':id')
  async getEnterpriseById(@Param('id') id: number) {
    try {
      return await this.enterpriseService.findById(Number(id));
    } catch (error) {
      throw new HttpException(
        `Failed to fetch enterprise: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Create a new enterprise.
   * @param body - The request body containing the name of the enterprise and the user ID.
   * @returns The newly created enterprise.
   */
  @Post()
  async createEnterprise(
    @Body('name') name: string,
    @Body('userId') userId: number,
  ) {
    if (!name || !userId) {
      throw new HttpException(
        'Enterprise name and user ID are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.enterpriseService.createEnterprise(
        name,
        Number(userId),
      );
    } catch (error) {
      throw new HttpException(
        `Failed to create enterprise: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update an existing enterprise.
   * @param id - The ID of the enterprise to update.
   * @param body - The request body containing the updated name of the enterprise and the user ID.
   * @returns The updated enterprise data.
   */
  @Put(':id')
  async updateEnterprise(
    @Param('id') id: number,
    @Body('name') name: string,
    @Body('userId') userId: number,
  ) {
    if (!name || !userId) {
      throw new HttpException(
        'Enterprise name and user ID are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.enterpriseService.updateEnterprise(
        Number(id),
        name,
        Number(userId),
      );
    } catch (error) {
      throw new HttpException(
        `Failed to update enterprise: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Delete an enterprise by its ID.
   * @param id - The ID of the enterprise to delete.
   * @param body - The request body containing the user ID.
   * @returns Success message or error.
   */
  @Delete(':id')
  async deleteEnterprise(
    @Param('id') id: number,
    @Body('userId') userId: number,
  ) {
    if (!userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.enterpriseService.deleteEnterprise(
        Number(id),
        Number(userId),
      );
    } catch (error) {
      throw new HttpException(
        `Failed to delete enterprise: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
