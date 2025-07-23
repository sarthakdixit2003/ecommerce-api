import { Transform } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsOptional, IsString } from "class-validator";
import { BaseFilterDto } from "src/commons/dtos/base-filter.dto";
import { PaginationDto } from "src/commons/dtos/pagination.dto";

export class ProductFilterDto extends BaseFilterDto {
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    @Transform(({value}) => {
        if(Array.isArray(value))
            return value;
        console.log(value === 'string' && value.length?
            value.split(',').map((v: any) => v.trim()):
            [])
        return typeof value === 'string' && value.length?
            value.split(',').map((v) => v.trim()):
            [];
    })
    category?: string[]
}

export class ProductDto extends PaginationDto implements ProductDto {
    @IsOptional()
    @IsArray()
    @ArrayNotEmpty()
    @IsString({ each: true })
    @Transform(({value}) => {
        if(Array.isArray(value))
            return value;
        return typeof value === 'string' && value.length?
            value.split(',').map((v) => v.trim()):
            [];
    })
    category?: string[]

    @IsOptional()
    @IsString()
    search?: string;
}