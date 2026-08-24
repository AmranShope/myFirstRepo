import { IOrderRepository } from '../repositories/order.repository';

export class CancelOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(userId: string, orderId: string): Promise<void> {
    if (!userId || !orderId) return;
    return this.orderRepository.cancelOrder(userId, orderId);
  }
}
