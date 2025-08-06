import { User } from "src/users/entities/user.entity";

export interface OrderAccessInterface {
    user: User;
    orderId: string;
}