import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { OrderItemsController } from './order-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order-item.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { ProductsModule } from 'src/products/products.module';
import { UserOwnershipGuard } from 'src/auth/UserOwnershipGuard';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem]), OrdersModule, ProductsModule],
  controllers: [OrderItemsController],
  providers: [OrderItemsService, UserOwnershipGuard],
})
export class OrderItemsModule {}
