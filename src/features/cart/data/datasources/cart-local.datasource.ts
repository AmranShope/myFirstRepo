import { CartItemEntity, CartTotalsEntity, PromoValidationResult } from '../../domain/entities/cart-item.entity';
import { ProductEntity } from '../../../catalog/domain/entities/product.entity';
import { PROMO_CODES } from '../../../../data/mockData';

const BASE_CART_STORAGE_KEY = 'troolly_cart';
const FREE_DELIVERY_THRESHOLD = 20000;
const BASE_DELIVERY_FEE = 1500;

export class CartLocalDataSource {
  private getStorageKey(userId?: string): string {
    if (!userId || userId === 'guest') {
      return `${BASE_CART_STORAGE_KEY}_guest`;
    }
    return `${BASE_CART_STORAGE_KEY}_${userId}`;
  }

  getItems(userId?: string): CartItemEntity[] {
    try {
      const key = this.getStorageKey(userId);
      const data = localStorage.getItem(key);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
      // Fallback check old legacy key if guest
      if (!userId || userId === 'guest') {
        const legacy = localStorage.getItem(BASE_CART_STORAGE_KEY);
        if (legacy) {
          const parsed = JSON.parse(legacy);
          if (Array.isArray(parsed)) return parsed;
        }
      }
      return [];
    } catch {
      return [];
    }
  }

  saveItems(items: CartItemEntity[], userId?: string): void {
    try {
      const key = this.getStorageKey(userId);
      localStorage.setItem(key, JSON.stringify(items));
    } catch (e) {
      console.warn('Error writing cart to localStorage:', e);
    }
  }

  addItem(items: CartItemEntity[], product: ProductEntity, quantity: number = 1, userId?: string): CartItemEntity[] {
    const existingIndex = items.findIndex(i => i.product.id === product.id);
    let updated: CartItemEntity[];

    if (existingIndex > -1) {
      updated = [...items];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity
      };
    } else {
      updated = [...items, { product, quantity, selectedUnit: product.unit }];
    }

    this.saveItems(updated, userId);
    return updated;
  }

  updateQuantity(items: CartItemEntity[], productId: string, quantity: number, userId?: string): CartItemEntity[] {
    let updated: CartItemEntity[];

    if (quantity <= 0) {
      updated = items.filter(i => i.product.id !== productId);
    } else {
      updated = items.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
      );
    }

    this.saveItems(updated, userId);
    return updated;
  }

  removeItem(items: CartItemEntity[], productId: string, userId?: string): CartItemEntity[] {
    const updated = items.filter(i => i.product.id !== productId);
    this.saveItems(updated, userId);
    return updated;
  }

  clearCart(userId?: string): void {
    try {
      const key = this.getStorageKey(userId);
      localStorage.removeItem(key);
      if (!userId || userId === 'guest') {
        localStorage.removeItem(BASE_CART_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Error clearing cart in localStorage:', e);
    }
  }

  calculateTotals(items: CartItemEntity[], promoCode?: string | null): CartTotalsEntity {
    const subtotal = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0;
    const deliveryFee = (subtotal === 0 || isFreeDelivery) ? 0 : BASE_DELIVERY_FEE;
    const remainingForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

    let discountAmount = 0;
    let appliedPromoCode: string | null = null;

    if (promoCode && promoCode.trim()) {
      const cleanCode = promoCode.trim().toUpperCase();
      const promo = PROMO_CODES[cleanCode];

      if (promo) {
        if (promo.discountPercent) {
          discountAmount = Math.round(subtotal * (promo.discountPercent / 100));
        } else if (promo.discountFixed) {
          discountAmount = promo.discountFixed;
        }

        if (discountAmount > subtotal) {
          discountAmount = subtotal;
        }
        appliedPromoCode = cleanCode;
      }
    }

    const total = Math.max(0, subtotal + deliveryFee - discountAmount);

    return {
      subtotal,
      deliveryFee,
      discountAmount,
      appliedPromoCode,
      total,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      remainingForFreeDelivery,
      isFreeDelivery
    };
  }

  validatePromo(code: string, subtotal: number): PromoValidationResult {
    const cleanCode = code.trim().toUpperCase();
    const promo = PROMO_CODES[cleanCode];

    if (!promo) {
      return {
        success: false,
        message: 'كوبون الخصم غير صالح أو منتهي الصلاحية.',
        discountAmount: 0,
        appliedCode: null
      };
    }

    if (promo.minSpend && subtotal < promo.minSpend) {
      return {
        success: false,
        message: `الحد الأدنى لاستخدام هذا الكود هو ${promo.minSpend.toLocaleString('ar-YE')} ر.ي.`,
        discountAmount: 0,
        appliedCode: null
      };
    }

    let discountAmount = 0;
    if (promo.discountPercent) {
      discountAmount = Math.round(subtotal * (promo.discountPercent / 100));
    } else if (promo.discountFixed) {
      discountAmount = promo.discountFixed;
    }

    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }

    return {
      success: true,
      message: `تم تفعيل الكوبون بنجاح! خصم ${promo.description}`,
      discountAmount,
      appliedCode: cleanCode
    };
  }
}
