import { IsNotEmpty, IsString } from "class-validator";

export class GetOrderDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
}