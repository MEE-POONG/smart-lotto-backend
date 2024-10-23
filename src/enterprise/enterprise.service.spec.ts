import { Test, TestingModule } from '@nestjs/testing';
import { EnterpriseService } from './enterprise.service';
import { PrismaService } from '../prisma/prisma.service';
import { HttpException } from '@nestjs/common';

describe('EnterpriseService', () => {
  let service: EnterpriseService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnterpriseService,
        {
          provide: PrismaService,
          useValue: {
            enterprise: {
              findMany: jest.fn(),
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

    service = module.get<EnterpriseService>(EnterpriseService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('findAll', () => {
    it('should return an array of enterprises', async () => {
      const mockEnterprises = [
        { enterprise_id: 1, enterprise_name: 'Test Enterprise' },
      ];
      jest
        .spyOn(prisma.enterprise, 'findMany')
        .mockResolvedValue(mockEnterprises);

      expect(await service.findAll()).toBe(mockEnterprises);
    });

    it('should throw an error if findMany fails', async () => {
      jest
        .spyOn(prisma.enterprise, 'findMany')
        .mockRejectedValue(new Error('DB Error'));

      await expect(service.findAll()).rejects.toThrow(HttpException);
    });
  });

  describe('findById', () => {
    it('should return an enterprise if found', async () => {
      const mockEnterprise = {
        enterprise_id: 1,
        enterprise_name: 'Test Enterprise',
      };
      jest
        .spyOn(prisma.enterprise, 'findUnique')
        .mockResolvedValue(mockEnterprise);

      expect(await service.findById(1)).toBe(mockEnterprise);
    });

    it('should throw an error if enterprise not found', async () => {
      jest.spyOn(prisma.enterprise, 'findUnique').mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(HttpException);
    });
  });

  describe('createEnterprise', () => {
    it('should create a new enterprise and log the creation', async () => {
      const mockEnterprise = {
        enterprise_id: 1,
        enterprise_name: 'New Enterprise',
      };
      jest.spyOn(prisma.enterprise, 'create').mockResolvedValue(mockEnterprise);
      jest.spyOn(prisma.changeLog, 'create').mockResolvedValue(null);

      expect(await service.createEnterprise('New Enterprise', 1)).toBe(
        mockEnterprise,
      );
      expect(prisma.changeLog.create).toHaveBeenCalled();
    });

    it('should throw an error if creation fails', async () => {
      jest
        .spyOn(prisma.enterprise, 'create')
        .mockRejectedValue(new Error('DB Error'));

      await expect(
        service.createEnterprise('New Enterprise', 1),
      ).rejects.toThrow(HttpException);
    });
  });

  // New tests for updateEnterprise
  describe('updateEnterprise', () => {
    it('should update an enterprise and log the update', async () => {
      const mockBeforeUpdate = {
        enterprise_id: 1,
        enterprise_name: 'Old Name',
      };
      const mockAfterUpdate = {
        enterprise_id: 1,
        enterprise_name: 'Updated Name',
      };

      jest
        .spyOn(prisma.enterprise, 'findUnique')
        .mockResolvedValue(mockBeforeUpdate);
      jest
        .spyOn(prisma.enterprise, 'update')
        .mockResolvedValue(mockAfterUpdate);
      jest.spyOn(prisma.changeLog, 'create').mockResolvedValue(null);

      const result = await service.updateEnterprise(1, 'Updated Name', 1);

      expect(result).toBe(mockAfterUpdate);
      expect(prisma.changeLog.create).toHaveBeenCalledWith({
        data: {
          entity_name: 'Enterprise',
          action: 'update',
          entity_id: 1,
          before_data: mockBeforeUpdate,
          after_data: mockAfterUpdate,
          user_id: 1,
          enterprise_id: 1,
        },
      });
    });

    it('should throw an error if enterprise to update is not found', async () => {
      jest.spyOn(prisma.enterprise, 'findUnique').mockResolvedValue(null);

      await expect(
        service.updateEnterprise(1, 'Updated Name', 1),
      ).rejects.toThrow(HttpException);
    });

    it('should throw an error if update fails', async () => {
      const mockBeforeUpdate = {
        enterprise_id: 1,
        enterprise_name: 'Old Name',
      };

      jest
        .spyOn(prisma.enterprise, 'findUnique')
        .mockResolvedValue(mockBeforeUpdate);
      jest
        .spyOn(prisma.enterprise, 'update')
        .mockRejectedValue(new Error('DB Error'));

      await expect(
        service.updateEnterprise(1, 'Updated Name', 1),
      ).rejects.toThrow(HttpException);
    });
  });

  // New tests for deleteEnterprise
  describe('deleteEnterprise', () => {
    it('should delete an enterprise and log the deletion', async () => {
      const mockEnterprise = {
        enterprise_id: 1,
        enterprise_name: 'Test Enterprise',
      };

      jest
        .spyOn(prisma.enterprise, 'findUnique')
        .mockResolvedValue(mockEnterprise);
      jest.spyOn(prisma.enterprise, 'delete').mockResolvedValue(mockEnterprise);
      jest.spyOn(prisma.changeLog, 'create').mockResolvedValue(null);

      const result = await service.deleteEnterprise(1, 1);

      expect(result).toEqual({ message: 'Enterprise deleted successfully' });
      expect(prisma.changeLog.create).toHaveBeenCalledWith({
        data: {
          entity_name: 'Enterprise',
          action: 'delete',
          entity_id: 1,
          before_data: mockEnterprise,
          user_id: 1,
          enterprise_id: 1,
        },
      });
    });

    it('should throw an error if enterprise to delete is not found', async () => {
      jest.spyOn(prisma.enterprise, 'findUnique').mockResolvedValue(null);

      await expect(service.deleteEnterprise(1, 1)).rejects.toThrow(
        HttpException,
      );
    });

    it('should throw an error if delete fails', async () => {
      const mockEnterprise = {
        enterprise_id: 1,
        enterprise_name: 'Test Enterprise',
      };

      jest
        .spyOn(prisma.enterprise, 'findUnique')
        .mockResolvedValue(mockEnterprise);
      jest
        .spyOn(prisma.enterprise, 'delete')
        .mockRejectedValue(new Error('DB Error'));

      await expect(service.deleteEnterprise(1, 1)).rejects.toThrow(
        HttpException,
      );
    });
  });
});
