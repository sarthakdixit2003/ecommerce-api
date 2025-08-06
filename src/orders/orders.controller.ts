import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { GetOrderDto } from './dtos/get-order.dto';
import { Order } from './entities/order.entity';
import { OrderOwnershipGuard } from 'src/auth/OrderOwnershipGuard';
import { OrderUserIdDto } from './dtos/order-user-id.dto';
import { OrderIdDto } from './dtos/order-id.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { OrderPatchDto } from './dtos/order-patch.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(OrderOwnershipGuard)
  @Get('all/user/:userId')
  @HttpCode(HttpStatus.OK)
  async getOrders(@Param() orderUserIdDto: OrderUserIdDto): Promise<Order[]> {
    return await this.ordersService.getAllOrdersByUser(orderUserIdDto);
  }

  @UseGuards(OrderOwnershipGuard)
  @Get(':id/user/:userId/')
  @HttpCode(HttpStatus.OK)
  async getOrderById(@Param() getOrderDto: GetOrderDto): Promise<Order | null> {
    return this.ordersService.getOrderById(getOrderDto);
  }

  @UseGuards(OrderOwnershipGuard)
  @Post('create/user/:userId')
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() orderUserIdDto: OrderUserIdDto): Promise<Order> {
    return await this.ordersService.createOrder(orderUserIdDto);
  }

  @UseGuards(OrderOwnershipGuard)
  @Patch('patch/user/:userId')
  @HttpCode(HttpStatus.OK)
  async PatchOrder(@Body() orderPatchDto: OrderPatchDto): Promise<UpdateResult> {
    return await this.ordersService.patchOrder(orderPatchDto);
  }

  @UseGuards(OrderOwnershipGuard)
  @Delete('delete/user/:userId')
  @HttpCode(HttpStatus.OK)
  async deleteOrder(@Body() orderIdDto: OrderIdDto): Promise<DeleteResult> {
    return this.ordersService.deleteOrder(orderIdDto);
  }
}
