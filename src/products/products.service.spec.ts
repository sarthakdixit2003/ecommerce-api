import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { ProductsService } from './products.service';
import { CategoriesService } from '../categories/categories.service';
import { InventoryService } from '../inventory/inventory.service';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { Inventory } from '../inventory/entities/inventory.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { InternalServerErrorException } from '@nestjs/common';
import { PaginationDto } from 'src/commons/dtos/pagination.dto';
import { ProductFilterDto } from './dtos/product-filter.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository: Repository<Product>;
  let categoriesService: CategoriesService;
  let inventoryService: InventoryService;

  const mockProductRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockCategoriesService = {
    getCategoryByName: jest.fn(),
  };

  const mockInventoryService = {
    createInventory: jest.fn(),
    updateInventory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
        {
          provide: InventoryService,
          useValue: mockInventoryService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    categoriesService = module.get<CategoriesService>(CategoriesService);
    inventoryService = module.get<InventoryService>(InventoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const page: PaginationDto = { page: 1, limit: 10 };
      const filters: ProductFilterDto = {};
      const expectedProducts: Product[] = [new Product()];
      mockProductRepository.find.mockResolvedValue(expectedProducts);

      const result = await service.getProducts(page, filters);

      expect(result).toEqual(expectedProducts);
      expect(mockProductRepository.find).toHaveBeenCalledWith(expect.any(Object));
    });
  });

  describe('getProductsById', () => {
    it('should return a product if found', async () => {
      const productIdDto = { id: 'some-uuid' };
      const expectedProduct = new Product();
      mockProductRepository.findOne.mockResolvedValue(expectedProduct);

      const result = await service.getProductsById(productIdDto);

      expect(result).toEqual(expectedProduct);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({
        relations: { category: true, inventory: true },
        where: { id: productIdDto.id },
      });
    });

    it('should return null if product not found', async () => {
      const productIdDto = { id: 'some-uuid' };
      mockProductRepository.findOne.mockResolvedValue(null);

      const result = await service.getProductsById(productIdDto);

      expect(result).toBeNull();
    });
  });

  describe('createProduct', () => {
    it('should create and return a product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Desc',
        price: 100,
        category: 'Test Category',
        inventoryItems: 10,
      };
      const category = new Category();
      category.name = createProductDto.category;
      const inventory = new Inventory();
      inventory.quantity = createProductDto.inventoryItems;
      const product = new Product();

      mockCategoriesService.getCategoryByName.mockResolvedValue(category);
      mockProductRepository.create.mockReturnValue(product);
      mockProductRepository.save.mockResolvedValue(product);

      const result = await service.createProduct(createProductDto);

      expect(result).toEqual(product);
      expect(mockCategoriesService.getCategoryByName).toHaveBeenCalledWith({ name: createProductDto.category });
      expect(mockProductRepository.create).toHaveBeenCalledWith(expect.objectContaining({
        name: createProductDto.name,
        description: createProductDto.description,
        price: createProductDto.price,
        category,
      }));
      expect(mockProductRepository.save).toHaveBeenCalledWith(product);
    });

    it('should throw an error if category does not exist', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Desc',
        price: 100,
        category: 'Test Category',
        inventoryItems: 10,
      };
      mockCategoriesService.getCategoryByName.mockResolvedValue(null);

      await expect(service.createProduct(createProductDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('updateProduct', () => {
    it('should update a product successfully', async () => {
      const updateProductDto: UpdateProductDto = {
        id: 'some-uuid',
        name: 'Updated Name',
      };
      const updateResult: UpdateResult = { affected: 1, raw: [], generatedMaps: [] };
      mockProductRepository.update.mockResolvedValue(updateResult);

      const result = await service.updateProduct(updateProductDto);

      expect(result).toEqual(updateResult);
      expect(mockProductRepository.update).toHaveBeenCalledWith(updateProductDto.id, { name: 'Updated Name' });
    });

    it('should handle category and inventory updates', async () => {
        const updateProductDto: UpdateProductDto = {
            id: 'some-uuid',
            category: 'New Category',
            inventoryItems: 50,
        };
        const category = new Category();
        category.name = 'New Category';
        const inventoryUpdateResult: UpdateResult = { affected: 1, raw: [], generatedMaps: [] };
        const productUpdateResult: UpdateResult = { affected: 1, raw: [], generatedMaps: [] };

        mockCategoriesService.getCategoryByName.mockResolvedValue(category);
        mockInventoryService.updateInventory.mockResolvedValue(inventoryUpdateResult);
        mockProductRepository.update.mockResolvedValue(productUpdateResult);

        const result = await service.updateProduct(updateProductDto);

        expect(result).toEqual(productUpdateResult);
        expect(mockCategoriesService.getCategoryByName).toHaveBeenCalledWith({ name: 'New Category' });
        expect(mockInventoryService.updateInventory).toHaveBeenCalledWith({ productId: 'some-uuid', quantity: 50 });
        expect(mockProductRepository.update).toHaveBeenCalledWith('some-uuid', { category });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const deleteProductDto = { id: 'some-uuid' };
      const deleteResult: DeleteResult = { affected: 1, raw: [] };
      mockProductRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.deleteProduct(deleteProductDto);

      expect(result).toEqual(deleteResult);
      expect(mockProductRepository.delete).toHaveBeenCalledWith({ id: deleteProductDto.id });
    });
  });
});