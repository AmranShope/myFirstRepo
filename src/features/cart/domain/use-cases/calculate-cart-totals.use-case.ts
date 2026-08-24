import { ICartRepository } from '../repositories/cart.repository';
import { CartItemEntity, CartTotalsEntity } from '../entities/cart-item.entity';

export class CalculateCartTotalsUseCase {
  constructor(private cartRepository: ICartRepository) {}

  execute(items: CartItemEntity[], promoCode?: string | null): CartTotalsEntity {
    return this.cartRepository.calculateTotals(items, promoCode);
  }
}
