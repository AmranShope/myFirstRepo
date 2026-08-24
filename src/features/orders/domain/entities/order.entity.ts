import { CartItemEntity } from '../../../cart/domain/entities/cart-item.entity';
import { Address } from '../../../../types';

export type OrderStatus = 'received' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled';

export interface DriverInfoEntity {
  name: string;
  phone: string;
  photo: string;
  vehicle: string;
  rating: number;
  currentLocName: string;
}

export interface OrderEntity {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: CartItemEntity[];
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  promoCodeUsed?: string;
  tipAmount: number;
  totalAmount: number;
  status: OrderStatus;
  address: Address;
  paymentMethod: 'cash' | 'hasib' | 'kuraimi' | 'flooss';
  deliverySlot: string;
  orderNotes?: string;
  driverInfo?: DriverInfoEntity;
  earnedPoints: number;
  userId?: string;
}

export interface CreateOrderParams {
  userId: string;
  items: CartItemEntity[];
  address: Address;
  paymentMethod: 'cash' | 'hasib' | 'kuraimi' | 'flooss';
  deliverySlot: string;
  orderNotes?: string;
  promoCodeUsed?: string;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
}
