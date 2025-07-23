import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CategoryIdDto } from './dtos/category-id.dto';
import { CategoryNameDto } from './dtos/category-name.dto';

@Injectable()
export class CategoriesService {
    private readonly logger = new Logger(CategoriesService.name);
    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>
    ) {}

    /**
     * 
     * @returns Array containing all categories
     */
    async getAllCategories(): Promise<Category[]> {
        try {
            const categories = await this.categoryRepository.find();
            return categories;
        } catch(error: any) {
            this.logger.error(`Unable to get categories: ${error.stack}`);
            throw new InternalServerErrorException();
        }
    }

    /**
     * 
     * @param categoryIdDto - id: string
     * @returns Category object with matching id
     */
    async getCategoryById(categoryIdDto: CategoryIdDto): Promise<Category | null> {
        try {
            return await this.categoryRepository.findOne({where: { id: categoryIdDto.id }})
        } catch(error) {
            this.logger.error(`Unable to fetch category by id-${categoryIdDto.id}: ${error.stack}`);
            throw new InternalServerErrorException();
        }
    }

    async createCategory(categoryNameDto: CategoryNameDto): Promise<Category> {
        try {
            const category: Category = this.categoryRepository.create({ name: categoryNameDto.name });
            return await this.categoryRepository.save(category);
        } catch(error: any) {
            this.logger.error(`Unable to create new categoy: ${error.stack}`);
            throw new InternalServerErrorException();
        }
    }
}
