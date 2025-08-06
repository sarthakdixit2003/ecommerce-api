import { IsNotEmpty, IsString } from "class-validator";

export class OrderIdDto {
    @IsString()
    @IsNotEmpty()
    id: string;
}