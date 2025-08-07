import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UserOwnershipGuard } from 'src/auth/UserOwnershipGuard';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), UsersModule],
  controllers: [OrdersController],
  providers: [OrdersService, UserOwnershipGuard],
  exports: [OrdersService]
})
export class OrdersModule {}
