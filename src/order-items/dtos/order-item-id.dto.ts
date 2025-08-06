import { IsNotEmpty, IsString } from "class-validator";

export class OrderItemIdDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}