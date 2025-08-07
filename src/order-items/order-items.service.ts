import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { OrderItemIdDto } from './dtos/order-item-id.dto';
import { CreateOrderItemDto } from './dtos/create-order-item.dto';
import { Order } from 'src/orders/entities/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { ProductsService } from 'src/products/products.service';
import { Product } from 'src/products/entities/product.entity';
import { OrderItemDeleteDto } from './dtos/order-item-delete.dto';

@Injectable()
export class OrderItemsService {
    private readonly logger = new Logger(OrderItemsService.name);
    constructor(
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        private ordersService: OrdersService,
        private productsService: ProductsService
    ) {}

    /**
     * 
     * @param orderItemIdDto 
     * @returns OrderItem, if found, otherwise null
     */
    async getOrderItemById(orderItemIdDto: OrderItemIdDto): Promise<OrderItem | null> {
        try {
            return await this.orderItemRepository.findOneBy({ id: orderItemIdDto.id });
        } catch(error: any) {
            this.logger.error(`Unable to get order item: ${error.stack}`);
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * 
     * @param createOrderItemDto 
     * @returns OrderItem created
     */
    async createOrderItem(createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
        try {
            const order: Order | null = await this.ordersService.getOrderById({ id: createOrderItemDto.orderId, userId: createOrderItemDto.userId });
            const product: Product | null = await this.productsService.getProductsById({ id: createOrderItemDto.productId });
            if(!order || !product) {
                throw new NotFoundException(`Order or Product not found!`);
            }
            const orderItem: OrderItem = this.orderItemRepository.create({ order: order, product: product, quantity: createOrderItemDto.quantity, price: createOrderItemDto.price || product.price });
            // Update the total price of the order
            const diff: number = createOrderItemDto.price? createOrderItemDto.price: product.price;
            const updateResult: UpdateResult = await this.ordersService.patchOrderTotal({ id: order.id, diff: diff * createOrderItemDto.quantity });
            return await this.orderItemRepository.save(orderItem);
        } catch (error: any) {
            this.logger.error(`Unable to create order item: ${error.stack}`);
            if(error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * 
     * @param orderItemDeleteDto 
     * @returns delete result
     */
    async deleteOrderItem(orderItemDeleteDto: OrderItemDeleteDto): Promise<DeleteResult> {
        try {
            return await this.orderItemRepository.delete({ id: orderItemDeleteDto.id });
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }
    }
}
