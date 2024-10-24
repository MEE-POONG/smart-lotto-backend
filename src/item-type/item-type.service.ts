import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ItemTypeService {
  constructor(private prisma: PrismaService) {}

  /**
   * Fetch all item types.
   * @returns A list of item types.
   */
  async findAll(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;
      const itemTypes = await this.prisma.itemType.findMany({
        skip,
        take: limit,
      });
      const total = await this.prisma.itemType.count();
      return { itemTypes, total, page, limit };
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve item types: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Find an item type by its ID.
   * @param id - The item type ID.
   * @returns The item type data if found.
   */
  async findById(id: number) {
    try {
      const itemType = await this.prisma.itemType.findUnique({
        where: { item_type_id: id },
      });

      if (!itemType) {
        throw new HttpException(
          `ItemType with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return itemType;
    } catch (error) {
      throw new HttpException(
        `Failed to find item type: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Create a new item type.
   * @param name - The name of the item type.
   * @param enterpriseId - The enterprise this item type belongs to.
   * @param userId - The user creating the item type.
   * @returns The newly created item type.
   */
  async createItemType(name: string, enterpriseId: number, userId: number) {
    try {
      const itemType = await this.prisma.itemType.create({
        data: {
          type_name: name,
          enterprise_id: enterpriseId,
        },
      });

      // Log the creation in the ChangeLog
      await this.prisma.changeLog.create({
        data: {
          entity_name: 'ItemType',
          action: 'create',
          entity_id: itemType.item_type_id,
          after_data: itemType,
          user_id: userId,
          enterprise_id: enterpriseId,
        },
      });

      return itemType;
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
   * @param name - The new name of the item type.
   * @param userId - The user updating the item type.
   * @returns The updated item type data.
   */
  async updateItemType(id: number, name: string, userId: number) {
    try {
      // Fetch current data before update
      const beforeData = await this.prisma.itemType.findUnique({
        where: { item_type_id: id },
      });

      if (!beforeData) {
        throw new HttpException(
          `ItemType with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedItemType = await this.prisma.itemType.update({
        where: { item_type_id: id },
        data: { type_name: name },
      });

      // Log the update in ChangeLog
      await this.prisma.changeLog.create({
        data: {
          entity_name: 'ItemType',
          action: 'update',
          entity_id: id,
          before_data: beforeData,
          after_data: updatedItemType,
          user_id: userId,
          enterprise_id: updatedItemType.enterprise_id,
        },
      });

      return updatedItemType;
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
   * @param userId - The user performing the deletion.
   * @returns Success message or error.
   */
  async deleteItemType(id: number, userId: number) {
    try {
      const itemType = await this.prisma.itemType.findUnique({
        where: { item_type_id: id },
      });

      if (!itemType) {
        throw new HttpException(
          `ItemType with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.itemType.delete({
        where: { item_type_id: id },
      });

      // Log the deletion in ChangeLog
      await this.prisma.changeLog.create({
        data: {
          entity_name: 'ItemType',
          action: 'delete',
          entity_id: id,
          before_data: itemType,
          user_id: userId,
          enterprise_id: itemType.enterprise_id,
        },
      });

      return { message: 'ItemType deleted successfully' };
    } catch (error) {
      throw new HttpException(
        `Failed to delete item type: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
