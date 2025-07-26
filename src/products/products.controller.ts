import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto, ProductFilterDto } from './dtos/product-filter.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/commons/dtos/pagination.dto';
import { ProductIdDto } from './dtos/product-id.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { UpdateResult } from 'typeorm';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProducts(@Query() query: ProductDto): Promise<Product[]> {
    const page: PaginationDto = { page: query.page, limit: query.limit };
    const filters: ProductFilterDto = { search: query.search, category: query.category };
    return this.productsService.getProducts(page, filters);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getProductById(@Param('id') productIdDto: ProductIdDto): Promise<Product | null> {
    return this.getProductById(productIdDto);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productsService.createProduct(createProductDto);
  }

  @Patch('update')
  @HttpCode(HttpStatus.OK)
  async updateProduct(@Body() updateProductDto: UpdateProductDto): Promise<UpdateResult> {
    return await this.productsService.updateProduct(updateProductDto);
  }
}
