import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateProductDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    description?: string;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    price?: number;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    category?: string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    inventoryItems?: number;
}