import { CartItemEntity, CartTotalsEntity, PromoValidationResult } from '../entities/cart-item.entity';
import { ProductEntity } from '../../../catalog/domain/entities/product.entity';

export interface ICartRepository {
  getCartItems(userId?: string): Promise<CartItemEntity[]>;
  saveCartItems(items: CartItemEntity[], userId?: string): Promise<void>;
  addItem(product: ProductEntity, quantity?: number, userId?: string): Promise<CartItemEntity[]>;
  updateItemQuantity(productId: string, quantity: number, userId?: string): Promise<CartItemEntity[]>;
  removeItem(productId: string, userId?: string): Promise<CartItemEntity[]>;
  clearCart(userId?: string): Promise<void>;
  calculateTotals(items: CartItemEntity[], promoCode?: string | null): CartTotalsEntity;
  validatePromoCode(code: string, subtotal: number): PromoValidationResult;
}
