import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeleteResult, UpdateResult } from 'typeorm';
import { OrderItemsService } from './order-items.service';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';
import { OrderItem } from './entities/order-item.entity';
import { Order } from '../orders/entities/order.entity';
import { Product } from '../products/entities/product.entity';
import { CreateOrderItemDto } from './dtos/create-order-item.dto';
import { OrderItemIdDto } from './dtos/order-item-id.dto';
import { OrderItemDeleteDto } from './dtos/order-item-delete.dto';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('OrderItemsService', () => {
  let service: OrderItemsService;
  let orderItemRepository: Repository<OrderItem>;
  let ordersService: OrdersService;
  let productsService: ProductsService;

  const mockOrderItemRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockOrdersService = {
    getOrderById: jest.fn(),
    patchOrderTotal: jest.fn(),
  };

  const mockProductsService = {
    getProductsById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderItemsService,
        {
          provide: getRepositoryToken(OrderItem),
          useValue: mockOrderItemRepository,
        },
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
        {
          provide: ProductsService,
          useValue: mockProductsService,
        },
      ],
    }).compile();

    service = module.get<OrderItemsService>(OrderItemsService);
    orderItemRepository = module.get<Repository<OrderItem>>(getRepositoryToken(OrderItem));
    ordersService = module.get<OrdersService>(OrdersService);
    productsService = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrderItemById', () => {
    it('should return an order item if found', async () => {
      const orderItemIdDto: OrderItemIdDto = { id: 'item-uuid', userId: 'user-uuid' };
      const expectedOrderItem = new OrderItem();
      mockOrderItemRepository.findOneBy.mockResolvedValue(expectedOrderItem);

      const result = await service.getOrderItemById(orderItemIdDto);

      expect(result).toEqual(expectedOrderItem);
      expect(mockOrderItemRepository.findOneBy).toHaveBeenCalledWith({ id: orderItemIdDto.id });
    });

    it('should return null if order item not found', async () => {
      const orderItemIdDto: OrderItemIdDto = { id: 'non-existent-uuid', userId: 'user-uuid' };
      mockOrderItemRepository.findOneBy.mockResolvedValue(null);

      const result = await service.getOrderItemById(orderItemIdDto);

      expect(result).toBeNull();
    });
  });

  describe('createOrderItem', () => {
    it('should create and return an order item', async () => {
      const createOrderItemDto: CreateOrderItemDto = {
        userId: 'user-uuid',
        orderId: 'order-uuid',
        productId: 'product-uuid',
        quantity: 2,
        price: 50,
      };
      const order = new Order();
      const product = new Product();
      product.price = 50;
      const orderItem = new OrderItem();
      const updateResult: UpdateResult = { affected: 1, raw: [], generatedMaps: [] };

      mockOrdersService.getOrderById.mockResolvedValue(order);
      mockProductsService.getProductsById.mockResolvedValue(product);
      mockOrderItemRepository.create.mockReturnValue(orderItem);
      mockOrderItemRepository.save.mockResolvedValue(orderItem);
      mockOrdersService.patchOrderTotal.mockResolvedValue(updateResult);

      const result = await service.createOrderItem(createOrderItemDto);

      expect(result).toEqual(orderItem);
      expect(mockOrdersService.getOrderById).toHaveBeenCalledWith({ id: createOrderItemDto.orderId, userId: createOrderItemDto.userId });
      expect(mockProductsService.getProductsById).toHaveBeenCalledWith({ id: createOrderItemDto.productId });
      expect(mockOrderItemRepository.create).toHaveBeenCalledWith({
        order: order,
        product: product,
        quantity: createOrderItemDto.quantity,
        price: createOrderItemDto.price,
      });
      expect(mockOrdersService.patchOrderTotal).toHaveBeenCalledWith({ id: order.id, diff: createOrderItemDto.price * createOrderItemDto.quantity });
      expect(mockOrderItemRepository.save).toHaveBeenCalledWith(orderItem);
    });

    it('should use product price if order item price is not provided', async () => {
      const createOrderItemDto = {
        userId: 'user-uuid',
        orderId: 'order-uuid',
        productId: 'product-uuid',
        quantity: 2,
      } as CreateOrderItemDto; // Cast to CreateOrderItemDto
      const order = new Order();
      const product = new Product();
      product.price = 100; // Product has a price
      const orderItem = new OrderItem();
      const updateResult: UpdateResult = { affected: 1, raw: [], generatedMaps: [] };

      mockOrdersService.getOrderById.mockResolvedValue(order);
      mockProductsService.getProductsById.mockResolvedValue(product);
      mockOrderItemRepository.create.mockReturnValue(orderItem);
      mockOrderItemRepository.save.mockResolvedValue(orderItem);
      mockOrdersService.patchOrderTotal.mockResolvedValue(updateResult);

      const result = await service.createOrderItem(createOrderItemDto);

      expect(result).toEqual(orderItem);
      expect(mockOrderItemRepository.create).toHaveBeenCalledWith({
        order: order,
        product: product,
        quantity: createOrderItemDto.quantity,
        price: product.price, // Should use product.price
      });
      expect(mockOrdersService.patchOrderTotal).toHaveBeenCalledWith({ id: order.id, diff: product.price * createOrderItemDto.quantity });
    });

    it('should throw NotFoundException if order or product not found', async () => {
      const createOrderItemDto = {
        userId: 'user-uuid',
        orderId: 'order-uuid',
        productId: 'product-uuid',
        quantity: 2,
      } as CreateOrderItemDto; // Cast to CreateOrderItemDto
      mockOrdersService.getOrderById.mockResolvedValue(null);
      mockProductsService.getProductsById.mockResolvedValue(new Product());

      await expect(service.createOrderItem(createOrderItemDto)).rejects.toThrow(NotFoundException);

      mockOrdersService.getOrderById.mockResolvedValue(new Order());
      mockProductsService.getProductsById.mockResolvedValue(null);

      await expect(service.createOrderItem(createOrderItemDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException on other errors', async () => {
      const createOrderItemDto = {
        userId: 'user-uuid',
        orderId: 'order-uuid',
        productId: 'product-uuid',
        quantity: 2,
      } as CreateOrderItemDto; // Cast to CreateOrderItemDto
      mockOrdersService.getOrderById.mockRejectedValue(new Error('DB error'));

      await expect(service.createOrderItem(createOrderItemDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('deleteOrderItem', () => {
    it('should delete an order item', async () => {
      const orderItemDeleteDto: OrderItemDeleteDto = { id: 'item-uuid' };
      const deleteResult: DeleteResult = { affected: 1, raw: [] };
      mockOrderItemRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.deleteOrderItem(orderItemDeleteDto);

      expect(result).toEqual(deleteResult);
      expect(mockOrderItemRepository.delete).toHaveBeenCalledWith({ id: orderItemDeleteDto.id });
    });

    it('should throw InternalServerErrorException on error', async () => {
      const orderItemDeleteDto: OrderItemDeleteDto = { id: 'item-uuid' };
      mockOrderItemRepository.delete.mockRejectedValue(new Error('DB error'));

      await expect(service.deleteOrderItem(orderItemDeleteDto)).rejects.toThrow(InternalServerErrorException);
    });
  });
});