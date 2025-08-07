import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto, ProductFilterDto } from './dtos/product-filter.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/commons/dtos/pagination.dto';
import { ProductIdDto } from './dtos/product-id.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { DeleteProductDto } from './dtos/delete-product.dto';

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
    return this.productsService.getProductsById(productIdDto);
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  async createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productsService.createProduct(createProductDto);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Patch('update')
  @HttpCode(HttpStatus.OK)
  async updateProduct(@Body() updateProductDto: UpdateProductDto): Promise<UpdateResult> {
    return await this.productsService.updateProduct(updateProductDto);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete('delete')
  @HttpCode(HttpStatus.OK)
  async deleteProduct(@Body() deleteProductDto: DeleteProductDto): Promise<DeleteResult> {
    return await this.productsService.deleteProduct(deleteProductDto);
  }
}
