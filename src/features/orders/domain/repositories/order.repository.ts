import { OrderEntity, CreateOrderParams } from '../entities/order.entity';

export interface IOrderRepository {
  getUserOrders(userId: string): Promise<OrderEntity[]>;
  getOrderById(userId: string, orderId: string): Promise<OrderEntity | null>;
  createOrder(params: CreateOrderParams): Promise<OrderEntity>;
  cancelOrder(userId: string, orderId: string): Promise<void>;
  listenToUserOrders(userId: string, callback: (orders: OrderEntity[]) => void): () => void;
}
