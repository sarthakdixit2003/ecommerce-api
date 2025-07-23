import { IsNotEmpty, IsString } from "class-validator";

export class CategoryNameDto {
    @IsString()
    @IsNotEmpty()
    name: string;
}