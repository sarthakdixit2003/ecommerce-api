import { FindManyOptions, FindOneOptions } from "typeorm"
import { Order } from "./entities/order.entity"
import { OrderPatchDto } from "./dtos/order-patch.dto";
import { status_enum } from "./enums/status.enum";
import { BadRequestException } from "@nestjs/common";

export const findOptionsWithUserId = (userId: string, orderId?: string): FindManyOptions<Order> | FindOneOptions<Order> => {
    const options: FindManyOptions<Order> | FindOneOptions<Order> = {
        relations: {
            user: true
        },
        where: {
            user: {
                id: userId
            }
        }
    };
    if(orderId) {
        options.where = {
            ...options.where,
            id: orderId
        }
    }
    return options;
}

export const validateOrderStatusUpdate = (order: Order, orderPatchDto: OrderPatchDto): boolean => {
    switch(order.status) {
        case status_enum.Shipped:
            throw new BadRequestException(`Cannot update status of ${order.status} Order`);
        case status_enum.Cancelled:
            throw new BadRequestException(`Cannot update status of ${order.status} Order`);
        case status_enum.Pending:
            return orderPatchDto.status === status_enum.Paid || orderPatchDto.status === status_enum.Cancelled;        
        case status_enum.Paid:
            return orderPatchDto.status === status_enum.Shipped || orderPatchDto.status === status_enum.Cancelled;
        default: 
            throw new BadRequestException(`Invalid Order Status: ${order.status}`);
    }
}