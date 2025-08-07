import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { InventoryService } from './inventory.service';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryDto } from './dtos/create-inventory.dto';
import { UpdateInventoryDto } from './dtos/update-inventory.dto';

describe('InventoryService', () => {
  let service: InventoryService;
  let repository: Repository<Inventory>;

  const mockInventoryRepository = {
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useValue: mockInventoryRepository,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
    repository = module.get<Repository<Inventory>>(getRepositoryToken(Inventory));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createInventory', () => {
    it('should create and return an inventory item', async () => {
      const createInventoryDto: CreateInventoryDto = { quantity: 100 };
      const inventory = new Inventory();
      mockInventoryRepository.create.mockReturnValue(inventory);
      mockInventoryRepository.save.mockResolvedValue(inventory);

      const result = await service.createInventory(createInventoryDto);

      expect(result).toEqual(inventory);
      expect(mockInventoryRepository.create).toHaveBeenCalledWith({ quantity: createInventoryDto.quantity });
      expect(mockInventoryRepository.save).toHaveBeenCalledWith(inventory);
    });
  });

  describe('updateInventory', () => {
    it('should update an inventory item', async () => {
      const updateInventoryDto: UpdateInventoryDto = { productId: 'product-uuid', quantity: 50 };
      const updateResult: UpdateResult = { affected: 1, raw: [], generatedMaps: [] };
      mockInventoryRepository.update.mockResolvedValue(updateResult);

      const result = await service.updateInventory(updateInventoryDto);

      expect(result).toEqual(updateResult);
      expect(mockInventoryRepository.update).toHaveBeenCalledWith({ product: { id: updateInventoryDto.productId } }, { quantity: updateInventoryDto.quantity });
    });
  });
});
