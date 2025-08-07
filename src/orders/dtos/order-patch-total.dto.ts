import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class OrderPatchTotalDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsNumber()
    @Type(() => Number)
    diff: number
}