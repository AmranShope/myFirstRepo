import { IOrderRepository } from '../../domain/repositories/order.repository';
import { OrderEntity, CreateOrderParams } from '../../domain/entities/order.entity';
import { OrderRemoteDataSource } from '../datasources/order-remote.datasource';

export class OrderRepositoryImpl implements IOrderRepository {
  constructor(private remoteDataSource: OrderRemoteDataSource = new OrderRemoteDataSource()) {}

  async getUserOrders(userId: string): Promise<OrderEntity[]> {
    return this.remoteDataSource.getUserOrders(userId);
  }

  async getOrderById(userId: string, orderId: string): Promise<OrderEntity | null> {
    return this.remoteDataSource.getOrderById(userId, orderId);
  }

  async createOrder(params: CreateOrderParams): Promise<OrderEntity> {
    return this.remoteDataSource.createOrder(params);
  }

  async cancelOrder(userId: string, orderId: string): Promise<void> {
    return this.remoteDataSource.cancelOrder(userId, orderId);
  }

  listenToUserOrders(userId: string, callback: (orders: OrderEntity[]) => void): () => void {
    return this.remoteDataSource.listenToUserOrders(userId, callback);
  }
}
