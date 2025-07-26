import { IsNotEmpty, IsString } from "class-validator";

export class ProductIdDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}