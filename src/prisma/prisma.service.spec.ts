import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should call $connect on PrismaClient', async () => {
      const connectSpy = jest.spyOn(service, '$connect').mockResolvedValueOnce(undefined);
      await service.onModuleInit();
      expect(connectSpy).toHaveBeenCalled();
    });
  });

  describe('onModuleDestroy', () => {
    it('should call $disconnect on PrismaClient', async () => {
      const disconnectSpy = jest.spyOn(service, '$disconnect').mockResolvedValueOnce(undefined);
      await service.onModuleDestroy();
      expect(disconnectSpy).toHaveBeenCalled();
    });
  });
});