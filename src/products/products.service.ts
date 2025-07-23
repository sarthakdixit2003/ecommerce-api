import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { FindManyOptions, FindOptions, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/commons/dtos/pagination.dto';
import { ProductFilterDto } from './dtos/product-filter.dto';
import { buildFindOptions } from './utils';

@Injectable()
export class ProductsService {
    private readonly logger = new Logger(Product.name);
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>
    ) {}

    async getProducts(page: PaginationDto, filters: ProductFilterDto): Promise<Product[]> {
        try {
            const options: FindManyOptions<Product> = buildFindOptions(page, filters);
            return await this.productRepository.find(options);
        } catch(error) {
            this.logger.error(`Unable to fetch Product: ${error.stack}`);
            throw new InternalServerErrorException();
        }
    }
}
