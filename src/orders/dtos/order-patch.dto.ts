import { IsNotEmpty, IsString } from "class-validator";
import { status_enum } from "../enums/status.enum";

export class OrderPatchDto {
    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    status: status_enum;
}