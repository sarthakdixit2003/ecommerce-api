import { Type } from "class-transformer";
import { IsInt, IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class UpdateInventoryDto {
    @IsString()
    @IsNotEmpty()
    productId: string;

    @IsInt()
    @Type(() => Number)
    @Min(1)
    quantity: number
}