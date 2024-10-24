import { Test, TestingModule } from '@nestjs/testing';
import { ItemTypeService } from './item-type.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException } from '@nestjs/common';

describe('ItemTypeService', () => {
  let service: ItemTypeService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemTypeService,
        {
          provide: PrismaService,
          useValue: {
            itemType: {
              findMany: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            changeLog: {
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ItemTypeService>(ItemTypeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('should return paginated item types and total count', async () => {
      const mockItemTypes = [
        {
          item_type_id: 1,
          type_name: 'Test Type',
          enterprise_id: 1,
          last_modified_by: 1,
        },
      ];
      const mockCount = 10;

      jest.spyOn(prisma.itemType, 'findMany').mockResolvedValue(mockItemTypes);
      jest.spyOn(prisma.itemType, 'count').mockResolvedValue(mockCount);

      const result = await service.findAll(1, 10);

      expect(result).toEqual({
        itemTypes: mockItemTypes,
        total: mockCount,
        page: 1,
        limit: 10,
      });
    });

    it('should throw an error if findMany fails', async () => {
      jest
        .spyOn(prisma.itemType, 'findMany')
        .mockRejectedValue(new Error('DB Error'));

      await expect(service.findAll(1, 10)).rejects.toThrow(HttpException);
    });
  });

  describe('findById', () => {
    it('should return an item type if found', async () => {
      const mockItemType = {
        item_type_id: 1,
        type_name: 'Test Type',
        enterprise_id: 1,
        last_modified_by: 1,
      };
      jest.spyOn(prisma.itemType, 'findUnique').mockResolvedValue(mockItemType);

      expect(await service.findById(1)).toBe(mockItemType);
    });

    it('should throw an error if item type not found', async () => {
      jest.spyOn(prisma.itemType, 'findUnique').mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(HttpException);
    });
  });

  describe('createItemType', () => {
    it('should create a new item type and log the creation', async () => {
      const mockItemType = {
        item_type_id: 1,
        type_name: 'New Type',
        enterprise_id: 1,
        last_modified_by: 1,
      };
      jest.spyOn(prisma.itemType, 'create').mockResolvedValue(mockItemType);
      jest.spyOn(prisma.changeLog, 'create').mockResolvedValue(null);

      expect(await service.createItemType('New Type', 1, 1)).toBe(mockItemType);
      expect(prisma.changeLog.create).toHaveBeenCalled();
    });

    it('should throw an error if creation fails', async () => {
      jest
        .spyOn(prisma.itemType, 'create')
        .mockRejectedValue(new Error('DB Error'));

      await expect(service.createItemType('New Type', 1, 1)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('updateItemType', () => {
    it('should update an item type and log the update', async () => {
      const mockBeforeUpdate = {
        item_type_id: 1,
        type_name: 'Old Name',
        enterprise_id: 1,
        last_modified_by: 1,
      };
      const mockAfterUpdate = {
        item_type_id: 1,
        type_name: 'Updated Name',
        enterprise_id: 1,
        last_modified_by: 1,
      };

      jest
        .spyOn(prisma.itemType, 'findUnique')
        .mockResolvedValue(mockBeforeUpdate);
      jest.spyOn(prisma.itemType, 'update').mockResolvedValue(mockAfterUpdate);
      jest.spyOn(prisma.changeLog, 'create').mockResolvedValue(null);

      const result = await service.updateItemType(1, 'Updated Name', 1);

      expect(result).toBe(mockAfterUpdate);
      expect(prisma.changeLog.create).toHaveBeenCalled();
    });

    it('should throw an error if item type to update is not found', async () => {
      jest.spyOn(prisma.itemType, 'findUnique').mockResolvedValue(null);

      await expect(
        service.updateItemType(1, 'Updated Name', 1),
      ).rejects.toThrow(HttpException);
    });

    it('should throw an error if update fails', async () => {
      const mockBeforeUpdate = {
        item_type_id: 1,
        type_name: 'Old Name',
        enterprise_id: 1,
        last_modified_by: 1,
      };

      jest
        .spyOn(prisma.itemType, 'findUnique')
        .mockResolvedValue(mockBeforeUpdate);
      jest
        .spyOn(prisma.itemType, 'update')
        .mockRejectedValue(new Error('DB Error'));

      await expect(
        service.updateItemType(1, 'Updated Name', 1),
      ).rejects.toThrow(HttpException);
    });
  });

  describe('deleteItemType', () => {
    it('should delete an item type and log the deletion', async () => {
      const mockItemType = {
        item_type_id: 1,
        type_name: 'Test Type',
        enterprise_id: 1,
        last_modified_by: 1,
      };

      jest.spyOn(prisma.itemType, 'findUnique').mockResolvedValue(mockItemType);
      jest.spyOn(prisma.itemType, 'delete').mockResolvedValue(mockItemType);
      jest.spyOn(prisma.changeLog, 'create').mockResolvedValue(null);

      const result = await service.deleteItemType(1, 1);

      expect(result).toEqual({ message: 'ItemType deleted successfully' });
      expect(prisma.changeLog.create).toHaveBeenCalled();
    });

    it('should throw an error if item type to delete is not found', async () => {
      jest.spyOn(prisma.itemType, 'findUnique').mockResolvedValue(null);

      await expect(service.deleteItemType(1, 1)).rejects.toThrow(HttpException);
    });

    it('should throw an error if delete fails', async () => {
      const mockItemType = {
        item_type_id: 1,
        type_name: 'Test Type',
        enterprise_id: 1,
        last_modified_by: 1,
      };

      jest.spyOn(prisma.itemType, 'findUnique').mockResolvedValue(mockItemType);
      jest
        .spyOn(prisma.itemType, 'delete')
        .mockRejectedValue(new Error('DB Error'));

      await expect(service.deleteItemType(1, 1)).rejects.toThrow(HttpException);
    });
  });
});
