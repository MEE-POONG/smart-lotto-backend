import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EnterpriseService {
  constructor(private prisma: PrismaService) {}

  /**
   * Fetch all enterprises.
   * @returns A list of enterprises.
   */
  async findAll() {
    try {
      return await this.prisma.enterprise.findMany();
    } catch (error) {
      throw new HttpException(
        `Failed to retrieve enterprises: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Find an enterprise by its ID.
   * @param id - The enterprise ID.
   * @returns The enterprise data if found.
   */
  async findById(id: number) {
    try {
      const enterprise = await this.prisma.enterprise.findUnique({
        where: { enterprise_id: id },
      });

      if (!enterprise) {
        throw new HttpException(
          `Enterprise with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      return enterprise;
    } catch (error) {
      throw new HttpException(
        `Failed to find enterprise: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Create a new enterprise.
   * @param name - The name of the new enterprise.
   * @param userId - The user who created the enterprise.
   * @returns The newly created enterprise.
   */
  async createEnterprise(name: string, userId: number) {
    try {
      const enterprise = await this.prisma.enterprise.create({
        data: {
          enterprise_name: name,
        },
      });

      // Log the creation in ChangeLog
      await this.prisma.changeLog.create({
        data: {
          entity_name: 'Enterprise',
          action: 'create',
          entity_id: enterprise.enterprise_id,
          user_id: userId,
          after_data: enterprise,
          enterprise_id: enterprise.enterprise_id,
        },
      });

      return enterprise;
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
   * @param name - The new name of the enterprise.
   * @param userId - The user who updated the enterprise.
   * @returns The updated enterprise data.
   */
  async updateEnterprise(id: number, name: string, userId: number) {
    try {
      // Fetch current data before update
      const beforeData = await this.prisma.enterprise.findUnique({
        where: { enterprise_id: id },
      });

      if (!beforeData) {
        throw new HttpException(
          `Enterprise with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedEnterprise = await this.prisma.enterprise.update({
        where: { enterprise_id: id },
        data: {
          enterprise_name: name,
        },
      });

      // Log the update in ChangeLog
      await this.prisma.changeLog.create({
        data: {
          entity_name: 'Enterprise',
          action: 'update',
          entity_id: id,
          before_data: beforeData,
          after_data: updatedEnterprise,
          user_id: userId,
          enterprise_id: id,
        },
      });

      return updatedEnterprise;
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
   * @param userId - The user who deleted the enterprise.
   * @returns Success message or error.
   */
  async deleteEnterprise(id: number, userId: number) {
    try {
      const enterprise = await this.prisma.enterprise.findUnique({
        where: { enterprise_id: id },
      });

      if (!enterprise) {
        throw new HttpException(
          `Enterprise with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }

      await this.prisma.enterprise.delete({
        where: { enterprise_id: id },
      });

      // Log the deletion in ChangeLog
      await this.prisma.changeLog.create({
        data: {
          entity_name: 'Enterprise',
          action: 'delete',
          entity_id: id,
          before_data: enterprise,
          user_id: userId,
          enterprise_id: id,
        },
      });

      return { message: 'Enterprise deleted successfully' };
    } catch (error) {
      throw new HttpException(
        `Failed to delete enterprise: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
