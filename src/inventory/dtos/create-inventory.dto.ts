import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class CreateInventoryDto {
    @IsInt()
    @Type(() => Number)
    @Min(1)
    quantity: number = 1
}