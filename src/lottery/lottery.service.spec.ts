import { Test, TestingModule } from '@nestjs/testing';
import { LotteryService } from './lottery.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('LotteryService', () => {
  let service: LotteryService;
  let prisma: PrismaService;

  const mockPrismaService = {
    lottery: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LotteryService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LotteryService>(LotteryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  const mockLottery = {
    lottery_id: 1,
    name: 'Test Lottery',
    enterprise: { name: 'Test Enterprise' },
    itemTypes: [],
    lastModifiedBy: { name: 'Test User' },
  };

  describe('create', () => {
    it('should create a lottery', async () => {
      mockPrismaService.lottery.create.mockResolvedValue(mockLottery);
      const result = await service.create({
        lottery_name: 'Test Lottery',
        draw_date: new Date(),
        enterprise_id: 1,
      });
      expect(result).toEqual(mockLottery);
    });
  });

  describe('findAll', () => {
    it('should return all lotteries', async () => {
      mockPrismaService.lottery.findMany.mockResolvedValue([mockLottery]);
      const result = await service.findAll();
      expect(result).toEqual([mockLottery]);
    });
  });

  describe('findOne', () => {
    it('should return a lottery by id', async () => {
      mockPrismaService.lottery.findUnique.mockResolvedValue(mockLottery);
      const result = await service.findOne(1);
      expect(result).toEqual(mockLottery);
    });

    it('should throw NotFoundException when lottery not found', async () => {
      mockPrismaService.lottery.findUnique.mockResolvedValue(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a lottery', async () => {
      mockPrismaService.lottery.update.mockResolvedValue(mockLottery);
      const result = await service.update(1, {
        lottery_name: 'Updated Lottery',
        draw_date: new Date(),
        enterprise_id: 1,
      });
      expect(result).toEqual(mockLottery);
    });
  });

  describe('remove', () => {
    it('should delete a lottery', async () => {
      mockPrismaService.lottery.delete.mockResolvedValue(mockLottery);
      const result = await service.remove(1);
      expect(result).toEqual(mockLottery);
    });
  });
});
