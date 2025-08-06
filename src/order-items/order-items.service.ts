import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { Repository } from 'typeorm';
import { OrderItemIdDto } from './dtos/order-item-id.dto';

@Injectable()
export class OrderItemsService {
    private readonly logger = new Logger(OrderItemsService.name);
    constructor(
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>
    ) {}

    /**
     * 
     * @param orderItemIdDto 
     * @returns Order item with required id, if found
     */
    async getOrderItemById(orderItemIdDto: OrderItemIdDto): Promise<OrderItem | null> {
        try {
            return await this.orderItemRepository.findOneBy({ id: orderItemIdDto.id });
        } catch(error: any) {
            this.logger.error(`Unable to get order item: ${error.stack}`);
            throw new InternalServerErrorException(error.message);
        }
    }

    async createOrderItem() {
        
    }
}
