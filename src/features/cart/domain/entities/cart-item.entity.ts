import { ProductEntity } from '../../../catalog/domain/entities/product.entity';

export interface CartItemEntity {
  product: ProductEntity;
  quantity: number;
  selectedUnit?: string;
}

export interface CartTotalsEntity {
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  appliedPromoCode: string | null;
  total: number;
  freeDeliveryThreshold: number;
  remainingForFreeDelivery: number;
  isFreeDelivery: boolean;
}

export interface PromoValidationResult {
  success: boolean;
  message: string;
  discountAmount: number;
  appliedCode: string | null;
}
