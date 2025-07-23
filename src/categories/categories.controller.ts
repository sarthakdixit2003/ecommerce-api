import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { CategoryIdDto } from './dtos/category-id.dto';
import { CategoryNameDto } from './dtos/category-name.dto';
import { Roles } from 'src/auth/roles.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  async getAllCategories(): Promise<Category[]> {
    return this.categoriesService.getAllCategories();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getCategoryById(@Param('id') categoryIdDto: CategoryIdDto): Promise<Category | null> {
    return this.categoriesService.getCategoryById(categoryIdDto);
  }

  @Post('create')
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async createCategory(@Body() categoryNameDto: CategoryNameDto): Promise<Category> {
    return await this.categoriesService.createCategory(categoryNameDto);
  }
}
