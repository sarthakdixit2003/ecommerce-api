import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Type(() => Number)
    @Min(1)
    price: number;

    @IsString()
    @IsNotEmpty()
    category: string;

    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    inventoryItems: number = 1
}