import { ICartRepository } from '../../domain/repositories/cart.repository';
import { CartItemEntity, CartTotalsEntity, PromoValidationResult } from '../../domain/entities/cart-item.entity';
import { ProductEntity } from '../../../catalog/domain/entities/product.entity';
import { CartLocalDataSource } from '../datasources/cart-local.datasource';
import { CartRemoteDataSource } from '../datasources/cart-remote.datasource';

export class CartRepositoryImpl implements ICartRepository {
  constructor(
    private localDataSource: CartLocalDataSource = new CartLocalDataSource(),
    private remoteDataSource: CartRemoteDataSource = new CartRemoteDataSource()
  ) {}

  async getCartItems(userId?: string): Promise<CartItemEntity[]> {
    // 1. Try local cache first for instant responsiveness
    const local = this.localDataSource.getItems(userId);
    if (local.length > 0) return local;

    // 2. If user is logged in, try remote Firestore
    if (userId && userId !== 'guest') {
      const remote = await this.remoteDataSource.getCart(userId);
      if (remote && remote.length > 0) {
        this.localDataSource.saveItems(remote, userId);
        return remote;
      }
    }
    return local;
  }

  async saveCartItems(items: CartItemEntity[], userId?: string): Promise<void> {
    this.localDataSource.saveItems(items, userId);
    if (userId && userId !== 'guest') {
      await this.remoteDataSource.saveCart(userId, items);
    }
  }

  async addItem(product: ProductEntity, quantity: number = 1, userId?: string): Promise<CartItemEntity[]> {
    const current = this.localDataSource.getItems(userId);
    const updated = this.localDataSource.addItem(current, product, quantity, userId);
    if (userId && userId !== 'guest') {
      this.remoteDataSource.saveCart(userId, updated).catch(() => {});
    }
    return updated;
  }

  async updateItemQuantity(productId: string, quantity: number, userId?: string): Promise<CartItemEntity[]> {
    const current = this.localDataSource.getItems(userId);
    const updated = this.localDataSource.updateQuantity(current, productId, quantity, userId);
    if (userId && userId !== 'guest') {
      this.remoteDataSource.saveCart(userId, updated).catch(() => {});
    }
    return updated;
  }

  async removeItem(productId: string, userId?: string): Promise<CartItemEntity[]> {
    const current = this.localDataSource.getItems(userId);
    const updated = this.localDataSource.removeItem(current, productId, userId);
    if (userId && userId !== 'guest') {
      this.remoteDataSource.saveCart(userId, updated).catch(() => {});
    }
    return updated;
  }

  async clearCart(userId?: string): Promise<void> {
    this.localDataSource.clearCart(userId);
    if (userId && userId !== 'guest') {
      await this.remoteDataSource.clearCart(userId);
    }
  }

  calculateTotals(items: CartItemEntity[], promoCode?: string | null): CartTotalsEntity {
    return this.localDataSource.calculateTotals(items, promoCode);
  }

  validatePromoCode(code: string, subtotal: number): PromoValidationResult {
    return this.localDataSource.validatePromo(code, subtotal);
  }
}
