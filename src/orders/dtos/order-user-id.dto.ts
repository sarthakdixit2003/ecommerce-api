import { IsNotEmpty, IsString } from "class-validator";

export class OrderUserIdDto {
    @IsString()
    @IsNotEmpty()
    userId: string;
}