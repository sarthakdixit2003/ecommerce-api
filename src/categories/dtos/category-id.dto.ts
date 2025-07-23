import { IsNotEmpty, IsString } from "class-validator";

export class CategoryIdDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}