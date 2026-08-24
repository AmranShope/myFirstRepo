import { useMemo, useCallback } from 'react';
import { useApp } from '../../../../context/AppContext';
import { OrderEntity } from '../../domain/entities/order.entity';

export function useOrders() {
  const { orders, placeOrder, cancelOrder } = useApp();

  const formattedOrders: OrderEntity[] = useMemo(() => {
    return (orders || []).map(o => ({
      id: o.id,
      orderNumber: o.orderNumber,
      createdAt: o.createdAt,
      items: o.items as any,
      subtotal: o.subtotal,
      deliveryFee: o.deliveryFee,
      discountAmount: o.discountAmount,
      promoCodeUsed: o.promoCodeUsed,
      tipAmount: o.tipAmount,
      totalAmount: o.totalAmount,
      status: o.status as any,
      address: o.address as any,
      paymentMethod: o.paymentMethod as any,
      deliverySlot: o.deliverySlot,
      orderNotes: o.orderNotes,
      earnedPoints: o.earnedPoints,
      driverInfo: o.driverInfo
    }));
  }, [orders]);

  const handlePlaceOrder = useCallback(async (params: any): Promise<OrderEntity> => {
    const created = await placeOrder(
      params.address,
      params.paymentMethod,
      params.orderNotes,
      params.deliverySlot
    );
    return created as any;
  }, [placeOrder]);

  const handleCancelOrder = useCallback(async (orderId: string): Promise<void> => {
    cancelOrder(orderId);
  }, [cancelOrder]);

  return {
    orders: formattedOrders,
    loading: false,
    error: null,
    placeOrder: handlePlaceOrder,
    cancelOrder: handleCancelOrder
  };
}

