import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult, FindManyOptions } from 'typeorm';
import { OrdersService } from './orders.service';
import { UsersService } from '../users/users.service';
import { Order } from './entities/order.entity';
import { User } from '../users/entities/user.entity';
import { GetOrderDto } from './dtos/get-order.dto';
import { OrderUserIdDto } from './dtos/order-user-id.dto';
import { OrderPatchStatusDto } from './dtos/order-patch-status.dto';
import { status_enum } from './enums/status.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { OrderPatchTotalDto } from './dtos/order-patch-total.dto';
import { OrderIdDto } from './dtos/order-id.dto';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: Repository<Order>;
  let usersService: UsersService;

  const mockOrderRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    increment: jest.fn(),
    delete: jest.fn(),
    findOneBy: jest.fn(),
  };

  const mockUsersService = {
    getOneUserByField: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrderById', () => {
    it('should return an order if found', async () => {
      const getOrderDto: GetOrderDto = { id: 'order-uuid', userId: 'user-uuid' };
      const expectedOrder = new Order();
      mockOrderRepository.findOne.mockResolvedValue(expectedOrder);

      const result = await service.getOrderById(getOrderDto);

      expect(result).toEqual(expectedOrder);
      expect(mockOrderRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('getAllOrdersByUser', () => {
    it('should return an array of orders for a user', async () => {
      const orderUserIdDto: OrderUserIdDto = { userId: 'user-uuid' };
      const expectedOrders: Order[] = [new Order()];
      mockOrderRepository.find.mockResolvedValue(expectedOrders);

      const result = await service.getAllOrdersByUser(orderUserIdDto);

      expect(result).toEqual(expectedOrders);
      expect(mockOrderRepository.find).toHaveBeenCalled();
    });
  });

  describe('createOrder', () => {
    it('should create and return an order', async () => {
      const orderUserIdDto: OrderUserIdDto = { userId: 'user-uuid' };
      const user = new User();
      const order = new Order();
      mockUsersService.getOneUserByField.mockResolvedValue(user);
      mockOrderRepository.create.mockReturnValue(order);
      mockOrderRepository.save.mockResolvedValue(order);

      const result = await service.createOrder(orderUserIdDto);

      expect(result).toEqual(order);
      expect(mockUsersService.getOneUserByField).toHaveBeenCalledWith(orderUserIdDto.userId, 'id');
      expect(mockOrderRepository.create).toHaveBeenCalledWith({ user });
      expect(mockOrderRepository.save).toHaveBeenCalledWith(order);
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const orderUserIdDto: OrderUserIdDto = { userId: 'user-uuid' };
      mockUsersService.getOneUserByField.mockResolvedValue(null);

      await expect(service.createOrder(orderUserIdDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('patchOrderStatus', () => {
    it('should update the order status', async () => {
        const dto: OrderPatchStatusDto = { id: 'order-uuid', status: status_enum.Paid };
        const order = { id: 'order-uuid', status: status_enum.Pending } as Order;
        const updateResult: UpdateResult = { affected: 1, raw: [], generatedMaps: [] };

        mockOrderRepository.findOneBy.mockResolvedValue(order);
        mockOrderRepository.update.mockResolvedValue(updateResult);

        const result = await service.patchOrderStatus(dto);

        expect(result).toEqual(updateResult);
        expect(mockOrderRepository.findOneBy).toHaveBeenCalledWith({ id: dto.id });
        expect(mockOrderRepository.update).toHaveBeenCalledWith({ id: order.id }, { status: dto.status });
    });

    it('should throw NotFoundException if order not found', async () => {
        const dto: OrderPatchStatusDto = { id: 'order-uuid', status: status_enum.Paid };
        mockOrderRepository.findOneBy.mockResolvedValue(null);
        await expect(service.patchOrderStatus(dto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid status update', async () => {
        const dto: OrderPatchStatusDto = { id: 'order-uuid', status: status_enum.Paid };
        const order = { id: 'order-uuid', status: status_enum.Shipped } as Order;
        mockOrderRepository.findOneBy.mockResolvedValue(order);
        await expect(service.patchOrderStatus(dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('patchOrderTotal', () => {
    it('should increment the order total', async () => {
      const dto: OrderPatchTotalDto = { id: 'order-uuid', diff: 100 };
      const updateResult: UpdateResult = { affected: 1, raw: [], generatedMaps: [] };
      mockOrderRepository.increment.mockResolvedValue(updateResult);

      const result = await service.patchOrderTotal(dto);

      expect(result).toEqual(updateResult);
      expect(mockOrderRepository.increment).toHaveBeenCalledWith({ id: dto.id }, 'total', dto.diff);
    });
  });

  describe('deleteOrder', () => {
    it('should delete an order', async () => {
      const dto: OrderIdDto = { id: 'order-uuid' };
      const deleteResult: DeleteResult = { affected: 1, raw: [] };
      mockOrderRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.deleteOrder(dto);

      expect(result).toEqual(deleteResult);
      expect(mockOrderRepository.delete).toHaveBeenCalledWith({ id: dto.id });
    });
  });
});
