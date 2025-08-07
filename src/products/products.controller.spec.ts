import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ProductDto } from './dtos/product-filter.dto';
import { ProductIdDto } from './dtos/product-id.dto';
import { DeleteProductDto } from './dtos/delete-product.dto';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  const mockProductsService = {
    getProducts: jest.fn(),
    getProductsById: jest.fn(),
    createProduct: jest.fn(),
    updateProduct: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProducts', () => {
    it('should return an array of products', async () => {
      const query: ProductDto = { page: 1, limit: 10 };
      const expectedProducts: Product[] = [new Product()];
      mockProductsService.getProducts.mockResolvedValue(expectedProducts);

      const result = await controller.getProducts(query);

      expect(result).toEqual(expectedProducts);
      expect(mockProductsService.getProducts).toHaveBeenCalledWith({ page: query.page, limit: query.limit }, { search: query.search, category: query.category });
    });
  });

  describe('getProductById', () => {
    it('should return a single product', async () => {
      const productIdDto: ProductIdDto = { id: 'some-uuid' };
      const expectedProduct = new Product();
      mockProductsService.getProductsById.mockResolvedValue(expectedProduct);

      const result = await controller.getProductById(productIdDto);

      expect(result).toEqual(expectedProduct);
      expect(mockProductsService.getProductsById).toHaveBeenCalledWith(productIdDto);
    });
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = { name: 'Test', description: 'Test', price: 100, category: 'Test', inventoryItems: 10 };
      const expectedProduct = new Product();
      mockProductsService.createProduct.mockResolvedValue(expectedProduct);

      const result = await controller.createProduct(createProductDto);

      expect(result).toEqual(expectedProduct);
      expect(mockProductsService.createProduct).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('updateProduct', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = { id: 'some-uuid', name: 'Updated' };
      const expectedResult: UpdateResult = { affected: 1, raw: [], generatedMaps: [] };
      mockProductsService.updateProduct.mockResolvedValue(expectedResult);

      const result = await controller.updateProduct(updateProductDto);

      expect(result).toEqual(expectedResult);
      expect(mockProductsService.updateProduct).toHaveBeenCalledWith(updateProductDto);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product', async () => {
      const deleteProductDto: DeleteProductDto = { id: 'some-uuid' };
      const expectedResult: DeleteResult = { affected: 1, raw: [] };
      mockProductsService.deleteProduct.mockResolvedValue(expectedResult);

      const result = await controller.deleteProduct(deleteProductDto);

      expect(result).toEqual(expectedResult);
      expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(deleteProductDto);
    });
  });
});