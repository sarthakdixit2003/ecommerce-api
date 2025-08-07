import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { DeleteResult, FindManyOptions, Repository, UpdateResult } from 'typeorm';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GetOrderDto } from './dtos/get-order.dto';
import { OrderUserIdDto } from './dtos/order-user-id.dto';
import { findOptionsWithUserId, validateOrderStatusUpdate } from './utils';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/entities/user.entity';
import { OrderIdDto } from './dtos/order-id.dto';
import { OrderPatchStatusDto } from './dtos/order-patch-status.dto';
import { OrderPatchTotalDto } from './dtos/order-patch-total.dto';

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);
    constructor(
        @InjectRepository(Order)
        private ordersRepository: Repository<Order>,
        private usersService: UsersService,
    ) {}

    /**
     * 
     * @param getOrderDto 
     * @returns Order with required id
     */
    async getOrderById(getOrderDto: GetOrderDto): Promise<Order | null> {
        try {
            const options: FindManyOptions<Order> = findOptionsWithUserId(getOrderDto.userId, getOrderDto.id);
            return await this.ordersRepository.findOne(options);
        } catch(error: any) {
            this.logger.error(`Unable to get order: ${error.stack}`);
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * 
     * @param orderUserIdDto 
     * @returns Array of orders with particular user id
     */
    async getAllOrdersByUser(orderUserIdDto: OrderUserIdDto): Promise<Order[]> {
        try {
            const options: FindManyOptions<Order> = findOptionsWithUserId(orderUserIdDto.userId);
            return await this.ordersRepository.find(options);
        } catch(error: any) {
            this.logger.error(`Unable to get orders: ${error.stack}`);
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * 
     * @param orderUserIdDto 
     * @returns created Order object
     */
    async createOrder(orderUserIdDto: OrderUserIdDto): Promise<Order> {
        try {
            const user: User | null = await this.usersService.getOneUserByField(orderUserIdDto.userId, 'id');
            if(!user) {
                throw new NotFoundException(`User not found!`);
            }
            const order: Order = this.ordersRepository.create({ user: user });
            return await this.ordersRepository.save(order);
        } catch(error: any) {
            this.logger.error(`Unable to create order: ${error.stack}`);
            if(error instanceof NotFoundException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * 
     * @param orderPatchDto 
     * @returns 
     */
    async patchOrderStatus(orderPatchStatusDto: OrderPatchStatusDto): Promise<UpdateResult> {
        try {
            const order: Order | null = await this.ordersRepository.findOneBy({ id: orderPatchStatusDto.id });
            if(!order) {
                throw new NotFoundException(`Order not found!`);
            }
            const validUpdate = validateOrderStatusUpdate(order, orderPatchStatusDto);
            return await this.ordersRepository.update({ id: order.id }, { status: orderPatchStatusDto.status });
        } catch (error: any) {
            this.logger.error(`Unable to patch order: ${error.stack}`);
            if(error instanceof NotFoundException || error instanceof BadRequestException) {
                throw error;
            }
            throw new InternalServerErrorException(error.message);
        }
    }

    async patchOrderTotal(orderPatchTotalDto: OrderPatchTotalDto): Promise<UpdateResult> {
        try {
            return await this.ordersRepository.increment({ id: orderPatchTotalDto.id }, 'total', orderPatchTotalDto.diff)
        } catch (error: any) {
            throw new InternalServerErrorException(error.message);
        }
    }

    /**
     * 
     * @param orderIdDto 
     * @returns delete result
     */
    async deleteOrder(orderIdDto: OrderIdDto): Promise<DeleteResult> {
        try {
            return await this.ordersRepository.delete({ id: orderIdDto.id });
        } catch(error: any) {
            this.logger.error(`Unable to delete order: ${error.stack}`);
            throw new InternalServerErrorException(error.message);
        }
    }
}
