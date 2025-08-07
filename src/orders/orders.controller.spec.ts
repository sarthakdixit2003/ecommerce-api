import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { GetOrderDto } from './dtos/get-order.dto';
import { OrderUserIdDto } from './dtos/order-user-id.dto';
import { OrderPatchStatusDto } from './dtos/order-patch-status.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { OrderIdDto } from './dtos/order-id.dto';
import { UserOwnershipGuard } from 'src/auth/UserOwnershipGuard';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  const mockOrdersService = {
    getAllOrdersByUser: jest.fn(),
    getOrderById: jest.fn(),
    createOrder: jest.fn(),
    patchOrderStatus: jest.fn(),
    deleteOrder: jest.fn(),
  };

  const mockUserOwnershipGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    })
    .overrideGuard(UserOwnershipGuard)
    .useValue(mockUserOwnershipGuard)
    .compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getOrders', () => {
    it('should return an array of orders for a user', async () => {
      const orderUserIdDto: OrderUserIdDto = { userId: 'user-uuid' };
      const expectedOrders: Order[] = [new Order()];
      mockOrdersService.getAllOrdersByUser.mockResolvedValue(expectedOrders);

      const result = await controller.getOrders(orderUserIdDto);

      expect(result).toEqual(expectedOrders);
      expect(mockOrdersService.getAllOrdersByUser).toHaveBeenCalledWith(orderUserIdDto);
    });
  });

  describe('getOrderById', () => {
    it('should return a single order', async () => {
      const getOrderDto: GetOrderDto = { id: 'order-uuid', userId: 'user-uuid' };
      const expectedOrder = new Order();
      mockOrdersService.getOrderById.mockResolvedValue(expectedOrder);

      const result = await controller.getOrderById(getOrderDto);

      expect(result).toEqual(expectedOrder);
      expect(mockOrdersService.getOrderById).toHaveBeenCalledWith(getOrderDto);
    });
  });

  describe('createOrder', () => {
    it('should create an order', async () => {
      const orderUserIdDto: OrderUserIdDto = { userId: 'user-uuid' };
      const expectedOrder = new Order();
      mockOrdersService.createOrder.mockResolvedValue(expectedOrder);

      const result = await controller.createOrder(orderUserIdDto);

      expect(result).toEqual(expectedOrder);
      expect(mockOrdersService.createOrder).toHaveBeenCalledWith(orderUserIdDto);
    });
  });

  describe('PatchOrder', () => {
    it('should patch an order status', async () => {
      const orderPatchStatusDto: OrderPatchStatusDto = { id: 'order-uuid', status: 'Paid' as any };
      const expectedResult: UpdateResult = { affected: 1, raw: [], generatedMaps: [] };
      mockOrdersService.patchOrderStatus.mockResolvedValue(expectedResult);

      const result = await controller.PatchOrder(orderPatchStatusDto);

      expect(result).toEqual(expectedResult);
      expect(mockOrdersService.patchOrderStatus).toHaveBeenCalledWith(orderPatchStatusDto);
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order', async () => {
      const orderIdDto: OrderIdDto = { id: 'order-uuid' };
      const expectedResult: DeleteResult = { affected: 1, raw: [] };
      mockOrdersService.deleteOrder.mockResolvedValue(expectedResult);

      const result = await controller.deleteOrder(orderIdDto);

      expect(result).toEqual(expectedResult);
      expect(mockOrdersService.deleteOrder).toHaveBeenCalledWith(orderIdDto);
    });
  });
});
