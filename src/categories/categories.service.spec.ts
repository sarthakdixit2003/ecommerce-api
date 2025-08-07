import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CategoryIdDto } from './dtos/category-id.dto';
import { CategoryNameDto } from './dtos/category-name.dto';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  const mockCategoryRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllCategories', () => {
    it('should return an array of categories', async () => {
      const expectedCategories: Category[] = [new Category()];
      mockCategoryRepository.find.mockResolvedValue(expectedCategories);

      const result = await service.getAllCategories();

      expect(result).toEqual(expectedCategories);
      expect(mockCategoryRepository.find).toHaveBeenCalled();
    });
  });

  describe('getCategoryById', () => {
    it('should return a category if found', async () => {
      const categoryIdDto: CategoryIdDto = { id: 'some-uuid' };
      const expectedCategory = new Category();
      mockCategoryRepository.findOne.mockResolvedValue(expectedCategory);

      const result = await service.getCategoryById(categoryIdDto);

      expect(result).toEqual(expectedCategory);
      expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({ where: { id: categoryIdDto.id } });
    });

    it('should return null if category not found', async () => {
      const categoryIdDto: CategoryIdDto = { id: 'some-uuid' };
      mockCategoryRepository.findOne.mockResolvedValue(null);

      const result = await service.getCategoryById(categoryIdDto);

      expect(result).toBeNull();
    });
  });

  describe('getCategoryByName', () => {
    it('should return a category if found', async () => {
      const categoryNameDto: CategoryNameDto = { name: 'Test Category' };
      const expectedCategory = new Category();
      mockCategoryRepository.findOneBy.mockResolvedValue(expectedCategory);

      const result = await service.getCategoryByName(categoryNameDto);

      expect(result).toEqual(expectedCategory);
      expect(mockCategoryRepository.findOneBy).toHaveBeenCalledWith({ name: categoryNameDto.name });
    });
  });

  describe('createCategory', () => {
    it('should create and return a category', async () => {
      const categoryNameDto: CategoryNameDto = { name: 'Test Category' };
      const category = new Category();
      mockCategoryRepository.create.mockReturnValue(category);
      mockCategoryRepository.save.mockResolvedValue(category);

      const result = await service.createCategory(categoryNameDto);

      expect(result).toEqual(category);
      expect(mockCategoryRepository.create).toHaveBeenCalledWith({ name: categoryNameDto.name });
      expect(mockCategoryRepository.save).toHaveBeenCalledWith(category);
    });
  });
});
