import { Test, TestingModule } from '@nestjs/testing';
import { ItemTypeController } from './item-type.controller';
import { ItemTypeService } from './item-type.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateItemTypeDto } from './dto/create-item-type.dto';
import { UpdateItemTypeDto } from './dto/update-item-type.dto';

describe('ItemTypeController', () => {
  let controller: ItemTypeController;
  let service: ItemTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemTypeController],
      providers: [
        {
          provide: ItemTypeService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findById: jest.fn().mockResolvedValue({}),
            createItemType: jest.fn().mockResolvedValue({}),
            updateItemType: jest.fn().mockResolvedValue({}),
            deleteItemType: jest.fn().mockResolvedValue({ message: 'Deleted' }),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard) // Mock the JwtAuthGuard
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ItemTypeController>(ItemTypeController);
    service = module.get<ItemTypeService>(ItemTypeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return an array of item types', async () => {
    const result = await controller.getAllItemTypes();
    expect(result).toEqual([]);
  });

  it('should return an item type by id', async () => {
    const result = await controller.getItemTypeById(1);
    expect(result).toEqual({});
  });

  it('should create a new item type', async () => {
    const createDto: CreateItemTypeDto = {
      type_name: 'Test Type',
      enterprise_id: 1,
      user_id: 1,
    };
    const result = await controller.createItemType(createDto);
    expect(result).toEqual({});
  });

  it('should update an existing item type', async () => {
    const updateDto: UpdateItemTypeDto = {
      type_name: 'Updated Name',
    };
    const result = await controller.updateItemType(1, updateDto, 1);
    expect(result).toEqual({});
  });

  it('should delete an item type by id', async () => {
    const result = await controller.deleteItemType(1, 1);
    expect(result).toEqual({ message: 'Deleted' });
  });
});
