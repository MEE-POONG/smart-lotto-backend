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
  Query,
} from '@nestjs/common';
import { ItemTypeService } from './item-type.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Assuming JWT authentication is in use
import { CreateItemTypeDto } from './dto/create-item-type.dto';
import { UpdateItemTypeDto } from './dto/update-item-type.dto';

@Controller('item-types')
@UseGuards(JwtAuthGuard) // Apply JWT auth guard to protect these routes
export class ItemTypeController {
  constructor(private readonly itemTypeService: ItemTypeService) {}

  /**
   * Fetch all item types.
   * @returns A list of item types.
   */
  @Get()
  async getAllItemTypes(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      return await this.itemTypeService.findAll(page, limit);
    } catch (error) {
      throw new HttpException(
        `Failed to fetch item types: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Fetch an item type by its ID.
   * @param id - The ID of the item type.
   * @returns The item type data.
   */
  @Get(':id')
  async getItemTypeById(@Param('id') id: number) {
    try {
      return await this.itemTypeService.findById(Number(id));
    } catch (error) {
      throw new HttpException(
        `Failed to fetch item type: ${error.message}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * Create a new item type.
   * @param body - The request body containing the item type name, enterprise ID, and user ID.
   * @returns The newly created item type.
   */
  @Post()
  async createItemType(@Body() createItemTypeDto: CreateItemTypeDto) {
    const { type_name, enterprise_id, user_id } = createItemTypeDto;
    try {
      return this.itemTypeService.createItemType(
        type_name,
        enterprise_id,
        user_id,
      );
    } catch (error) {
      throw new HttpException(
        `Failed to create item type: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Update an existing item type.
   * @param id - The ID of the item type to update.
   * @param body - The request body containing the updated item type name and user ID.
   * @returns The updated item type data.
   */
  @Put(':id')
  async updateItemType(
    @Param('id') id: number,
    @Body() updateItemTypeDto: UpdateItemTypeDto,
    @Body('userId') userId: number,
  ) {
    if (!updateItemTypeDto.type_name || !userId) {
      throw new HttpException(
        'Item type name and user ID are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return this.itemTypeService.updateItemType(
        id,
        updateItemTypeDto.type_name,
        userId,
      );
    } catch (error) {
      throw new HttpException(
        `Failed to update item type: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Delete an item type by its ID.
   * @param id - The ID of the item type to delete.
   * @param body - The request body containing the user ID.
   * @returns Success message or error.
   */
  @Delete(':id')
  async deleteItemType(
    @Param('id') id: number,
    @Body('userId') userId: number,
  ) {
    if (!userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.itemTypeService.deleteItemType(
        Number(id),
        Number(userId),
      );
    } catch (error) {
      throw new HttpException(
        `Failed to delete item type: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
