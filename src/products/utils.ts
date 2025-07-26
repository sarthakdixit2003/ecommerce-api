import { FindManyOptions, FindOptions, ILike, In } from "typeorm";
import { Product } from "./entities/product.entity";
import { PaginationDto } from "src/commons/dtos/pagination.dto";
import { ProductFilterDto } from "./dtos/product-filter.dto";
import { UpdateProductDto } from "./dtos/update-product.dto";

export const buildFindOptions = (page: PaginationDto, filters: ProductFilterDto): FindManyOptions<Product> => {
    const options: FindManyOptions<Product> = {
        relations: {
            category: true
        },
        skip: (page.page - 1) * page.limit,
        take: page.limit,
        where: {}
    };

    if(filters.search) {
        options.where = {
            ...options.where,
            name: ILike(`%${filters.search}%`)
        }
    }

    if(filters.category) {
        options.where = {
            ...options.where,
            category: {
                name: In(filters.category)
            }
        }
    }

    return options;
}
