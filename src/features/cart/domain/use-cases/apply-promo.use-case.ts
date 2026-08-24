import { ICartRepository } from '../repositories/cart.repository';
import { PromoValidationResult } from '../entities/cart-item.entity';

export class ApplyPromoUseCase {
  constructor(private cartRepository: ICartRepository) {}

  execute(code: string, subtotal: number): PromoValidationResult {
    return this.cartRepository.validatePromoCode(code, subtotal);
  }
}
