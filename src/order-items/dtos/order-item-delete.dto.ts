import { IsNotEmpty, IsString } from "class-validator";

export class OrderItemDeleteDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}