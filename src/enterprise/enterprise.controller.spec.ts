import { Test, TestingModule } from '@nestjs/testing';
import { EnterpriseController } from './enterprise.controller';
import { EnterpriseService } from './enterprise.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

describe('EnterpriseController', () => {
  let controller: EnterpriseController;
  let service: EnterpriseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnterpriseController],
      providers: [
        {
          provide: EnterpriseService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findById: jest.fn().mockResolvedValue({}),
            createEnterprise: jest.fn().mockResolvedValue({}),
            updateEnterprise: jest.fn().mockResolvedValue({}),
            deleteEnterprise: jest
              .fn()
              .mockResolvedValue({ message: 'Deleted' }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Mock the JwtAuthGuard for tests
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<EnterpriseController>(EnterpriseController);
    service = module.get<EnterpriseService>(EnterpriseService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of enterprises', async () => {
    const result = await controller.getAllEnterprises();
    expect(result).toEqual([]);
  });

  it('should return an enterprise by id', async () => {
    const result = await controller.getEnterpriseById(1);
    expect(result).toEqual({});
  });

  it('should create a new enterprise', async () => {
    const result = await controller.createEnterprise('Test Enterprise', 1);
    expect(result).toEqual({});
  });

  it('should update an existing enterprise', async () => {
    const result = await controller.updateEnterprise(1, 'Updated Name', 1);
    expect(result).toEqual({});
  });

  it('should delete an enterprise by id', async () => {
    const result = await controller.deleteEnterprise(1, 1);
    expect(result).toEqual({ message: 'Deleted' });
  });
});
