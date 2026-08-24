import { useMemo, useCallback } from 'react';
import { useApp } from '../../../../context/AppContext';
import { CartItemEntity, CartTotalsEntity, PromoValidationResult } from '../../domain/entities/cart-item.entity';
import { ProductEntity } from '../../../catalog/domain/entities/product.entity';

export function useCart() {
  const {
    cart,
    cartSubtotal,
    cartTotal,
    discountAmount,
    deliveryFee,
    appliedCode,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon
  } = useApp();

  const items: CartItemEntity[] = useMemo(() => {
    return cart.map(item => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        category: item.product.category,
        price: item.product.price,
        originalPrice: item.product.originalPrice,
        image: item.product.image,
        unit: item.product.unit,
        description: item.product.description,
        rating: item.product.rating,
        salesCount: item.product.salesCount,
        inStock: item.product.inStock,
        badge: item.product.badge,
        tags: item.product.tags,
        selectedVariant: item.selectedVariant
      },
      quantity: item.quantity,
      selectedVariant: item.selectedVariant
    }));
  }, [cart]);

  const totals: CartTotalsEntity = useMemo(() => ({
    subtotal: cartSubtotal,
    deliveryFee,
    discountAmount,
    appliedPromoCode: appliedCode,
    total: cartTotal,
    freeDeliveryThreshold: 5000,
    remainingForFreeDelivery: Math.max(0, 5000 - cartSubtotal),
    isFreeDelivery: deliveryFee === 0
  }), [cartSubtotal, deliveryFee, discountAmount, appliedCode, cartTotal]);

  const itemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const addItem = useCallback((product: ProductEntity, quantity: number = 1, variant?: any) => {
    addToCart(product as any, quantity, variant);
  }, [addToCart]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    updateCartQuantity(productId, quantity);
  }, [updateCartQuantity]);

  const removeItem = useCallback((productId: string) => {
    removeFromCart(productId);
  }, [removeFromCart]);

  const clear = useCallback(() => {
    clearCart();
  }, [clearCart]);

  const applyPromoCode = useCallback((code: string): PromoValidationResult => {
    const res = applyCoupon(code);
    return {
      success: res.success,
      message: res.message,
      discountAmount: discountAmount,
      appliedCode: res.success ? code : null
    };
  }, [applyCoupon, discountAmount]);

  const removePromoCode = useCallback(() => {
    removeCoupon();
  }, [removeCoupon]);

  return {
    items,
    itemCount,
    totals,
    appliedPromo: appliedCode,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    applyPromoCode,
    removePromoCode
  };
}

