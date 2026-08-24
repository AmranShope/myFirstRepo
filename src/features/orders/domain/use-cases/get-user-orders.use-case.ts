import { IOrderRepository } from '../repositories/order.repository';
import { OrderEntity } from '../entities/order.entity';

export class GetUserOrdersUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(userId: string): Promise<OrderEntity[]> {
    if (!userId) return [];
    return this.orderRepository.getUserOrders(userId);
  }
}
