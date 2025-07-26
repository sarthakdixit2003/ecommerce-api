import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { FindManyOptions, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/commons/dtos/pagination.dto';
import { ProductFilterDto } from './dtos/product-filter.dto';
import { buildFindOptions } from './utils';
import { ProductIdDto } from './dtos/product-id.dto';
import { CreateProductDto } from './dtos/create-product.dto';
import { Category } from 'src/categories/entities/category.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { InventoryService } from 'src/inventory/inventory.service';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { UpdateProductDto } from './dtos/update-product.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

@Injectable()
export class ProductsService {
    private readonly logger = new Logger(Product.name);
    constructor(
        private categoriesService: CategoriesService,
        private inventoryService: InventoryService,
        @InjectRepository(Product)  private productRepository: Repository<Product>,
    ) {}

    /**
     * 
     * @param page 
     * @param filters 
     * @returns array of filtered Products
     */
    async getProducts(page: PaginationDto, filters: ProductFilterDto): Promise<Product[]> {
        try {
            const options: FindManyOptions<Product> = buildFindOptions(page, filters);
            return await this.productRepository.find(options);
        } catch(error) {
            this.logger.error(`Unable to fetch Product: ${error.stack}`);
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * 
     * @param productIdDto 
     * @returns product with required id or null if not found
     */
    async getProductsById(productIdDto: ProductIdDto): Promise<Product | null> {
        try {
            const product: Product | null = await this.productRepository.findOne({
                relations: {
                    category: true,
                    inventory: true
                },
                where: {
                    id: productIdDto.id
                }
            });
            return product;
        } catch(error: any) {
            this.logger.error(`Unable to fetch product with id-${productIdDto.id}: ${error.stack}`);
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * 
     * @param createProductDto 
     * @returns new Product
     */
    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        try {
            const category: Category | null = await this.categoriesService.getCategoryByName({ name: createProductDto.category });
            if(!category) {
                throw new InternalServerErrorException(`Category with id-${createProductDto.category} does not exist`);
            }
            const inventory: Inventory = await this.inventoryService.createInventory({ quantity: createProductDto.inventoryItems })
            const product: Product = this.productRepository.create({ name: createProductDto.name, description: createProductDto.description, price: createProductDto.price, category: category, inventory: inventory });
            return await this.productRepository.save(product);            
        } catch(error: any) {
            this.logger.error(`Unable to create new product: ${error.stack}`);
            throw new InternalServerErrorException(error.message);
        }
    }

    async updateProduct(updateProductDto: UpdateProductDto): Promise<UpdateResult> {
        try {
            const { id, inventoryItems: items, category: categoryStr, ...rest } = updateProductDto;
            const updatedParams: QueryDeepPartialEntity<Product> = { ...rest }
            let category: Category | null = null;
            if(categoryStr) {
                category = await this.categoriesService.getCategoryByName({name: categoryStr});
                if(!category) {
                    throw new InternalServerErrorException(`Category ${categoryStr} does not exist`);
                }
                updatedParams.category = category;
            }
            if(items != null) {
                const inventoryUpdateResult: UpdateResult = await this.inventoryService.updateInventory({ productId: id, quantity: items });
                this.logger.log(`Inventory updated for product(${id}): ${inventoryUpdateResult}`);
            }

            return await this.productRepository.update(updateProductDto.id, updatedParams)
        } catch(error: any) {
            this.logger.error(`Unable to update product: ${error.stack}`);
            throw new InternalServerErrorException(error.message);
        }
    }
}
