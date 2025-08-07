import { Test, TestingModule } from '@nestjs/testing';
import { OrderItemsController } from './order-items.controller';
import { OrderItemsService } from './order-items.service';
import { OrderItem } from './entities/order-item.entity';
import { DeleteResult } from 'typeorm';

describe('OrderItemsController', () => {
  let controller: OrderItemsController;
  let service: OrderItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderItemsController],
      providers: [
        {
          provide: OrderItemsService,
          useValue: {
            getOrderItemById: jest.fn(),
            createOrderItem: jest.fn(),
            deleteOrderItem: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderItemsController>(OrderItemsController);
    service = module.get<OrderItemsService>(OrderItemsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOrderItemById', () => {
    it('should return an order item', async () => {
      const result: OrderItem = {} as any;
      jest.spyOn(service, 'getOrderItemById').mockResolvedValue(result);
      expect(await controller.getOrderItemById({ id: '1', userId: '1' })).toBe(result);
    });
  });

  describe('createOrderItem', () => {
    it('should create an order item', async () => {
      const result: OrderItem = {} as any;
      jest.spyOn(service, 'createOrderItem').mockResolvedValue(result);
      expect(await controller.createOrderItem({} as any)).toBe(result);
    });
  });

  describe('deleteOrderItem', () => {
    it('should delete an order item', async () => {
      const result: DeleteResult = {} as any;
      jest.spyOn(service, 'deleteOrderItem').mockResolvedValue(result);
      expect(await controller.deleteOrderItem({} as any)).toBe(result);
    });
  });
});