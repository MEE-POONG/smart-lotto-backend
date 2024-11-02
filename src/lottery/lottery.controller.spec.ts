import { Test, TestingModule } from '@nestjs/testing';
import { LotteryController } from './lottery.controller';
import { LotteryService } from './lottery.service';
import { LotteryDto } from './dto/lottery.dto';

describe('LotteryController', () => {
  let controller: LotteryController;
  let service: LotteryService;

  const mockLotteryService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LotteryController],
      providers: [
        {
          provide: LotteryService,
          useValue: mockLotteryService,
        },
      ],
    }).compile();

    controller = module.get<LotteryController>(LotteryController);
    service = module.get<LotteryService>(LotteryService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new lottery', async () => {
      const dto: LotteryDto = {
        lottery_name: 'Test Lottery',
        draw_date: new Date(),
        enterprise_id: 1
      };
      mockLotteryService.create.mockResolvedValue(dto);

      expect(await controller.create(dto)).toBe(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of lotteries', async () => {
      const result = [
        {
          /* add mock lottery data */
        },
      ];
      mockLotteryService.findAll.mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single lottery', async () => {
      const result = {
        /* add mock lottery data */
      };
      mockLotteryService.findOne.mockResolvedValue(result);

      expect(await controller.findOne('1')).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a lottery', async () => {
      const dto: LotteryDto = {
        lottery_name: 'Test Lottery',
        draw_date: new Date(),
        enterprise_id: 1
      };
      mockLotteryService.update.mockResolvedValue(dto);

      expect(await controller.update('1', dto)).toBe(dto);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should remove a lottery', async () => {
      const result = {
        /* add mock lottery data */
      };
      mockLotteryService.remove.mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
