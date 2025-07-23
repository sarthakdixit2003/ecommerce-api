import { Controller, Get, Query, Request, ValidationPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto, ProductFilterDto } from './dtos/product-filter.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/commons/dtos/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getProducts(@Query() query: ProductDto): Promise<Product[]> {
    const page: PaginationDto = { page: query.page, limit: query.limit };
    const filters: ProductFilterDto = { search: query.search, category: query.category };
    return this.productsService.getProducts(page, filters);
  }
}
