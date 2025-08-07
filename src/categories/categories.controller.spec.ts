import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CategoryIdDto } from './dtos/category-id.dto';
import { CategoryNameDto } from './dtos/category-name.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

  const mockCategoriesService = {
    getAllCategories: jest.fn(),
    getCategoryById: jest.fn(),
    createCategory: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('should return an array of categories', async () => {
      const expectedCategories: Category[] = [new Category()];
      mockCategoriesService.getAllCategories.mockResolvedValue(expectedCategories);

      const result = await controller.getAllCategories();

      expect(result).toEqual(expectedCategories);
      expect(mockCategoriesService.getAllCategories).toHaveBeenCalled();
    });
  });

  describe('getCategoryById', () => {
    it('should return a single category', async () => {
      const categoryIdDto: CategoryIdDto = { id: 'some-uuid' };
      const expectedCategory = new Category();
      mockCategoriesService.getCategoryById.mockResolvedValue(expectedCategory);

      const result = await controller.getCategoryById(categoryIdDto);

      expect(result).toEqual(expectedCategory);
      expect(mockCategoriesService.getCategoryById).toHaveBeenCalledWith(categoryIdDto);
    });
  });

  describe('createCategory', () => {
    it('should create a category', async () => {
      const categoryNameDto: CategoryNameDto = { name: 'Test Category' };
      const expectedCategory = new Category();
      mockCategoriesService.createCategory.mockResolvedValue(expectedCategory);

      const result = await controller.createCategory(categoryNameDto);

      expect(result).toEqual(expectedCategory);
      expect(mockCategoriesService.createCategory).toHaveBeenCalledWith(categoryNameDto);
    });
  });
});
