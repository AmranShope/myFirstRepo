import { IOrderRepository } from '../repositories/order.repository';
import { OrderEntity, CreateOrderParams } from '../entities/order.entity';

export class PlaceOrderUseCase {
  constructor(private orderRepository: IOrderRepository) {}

  async execute(params: CreateOrderParams): Promise<OrderEntity> {
    if (!params.items || params.items.length === 0) {
      throw new Error('لا يمكن إتمام الطلب وسلة التسوق فارغة.');
    }

    if (!params.address) {
      throw new Error('يرجى تحديد عنوان التوصيل.');
    }

    return this.orderRepository.createOrder(params);
  }
}
