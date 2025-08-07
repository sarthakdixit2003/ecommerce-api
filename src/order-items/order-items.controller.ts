import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { UserOwnershipGuard } from 'src/auth/UserOwnershipGuard';
import { OrderItemIdDto } from './dtos/order-item-id.dto';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dtos/create-order-item.dto';
import { DeleteResult } from 'typeorm';
import { OrderItemDeleteDto } from './dtos/order-item-delete.dto';

@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @UseGuards(UserOwnershipGuard)
  @Get(':id/user/:userId')
  @HttpCode(HttpStatus.OK)
  async getOrderItemById(@Param() orderItemIdDto: OrderItemIdDto): Promise<OrderItem | null> {
    return this.orderItemsService.getOrderItemById(orderItemIdDto);
  }

  @UseGuards(UserOwnershipGuard)
  @Post('create/user/:userId')
  @HttpCode(HttpStatus.CREATED)
  async createOrderItem(@Body() createOrderItemDto: CreateOrderItemDto): Promise<OrderItem> {
    return this.orderItemsService.createOrderItem(createOrderItemDto);
  }

  @UseGuards(UserOwnershipGuard)
  @Delete('delete/user/:userId')
  @HttpCode(HttpStatus.OK)
  async deleteOrderItem(@Body() orderItemDeleteDto: OrderItemDeleteDto): Promise<DeleteResult> {
    return this.orderItemsService.deleteOrderItem(orderItemDeleteDto);
  }
}
