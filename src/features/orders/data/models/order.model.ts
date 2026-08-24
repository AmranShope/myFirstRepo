import { OrderEntity } from '../../domain/entities/order.entity';

export class OrderModel {
  static toFirestore(order: OrderEntity): Record<string, any> {
    return {
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      items: order.items.map(item => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          unit: item.product.unit,
          image: item.product.image,
          categoryId: item.product.categoryId,
          categoryName: item.product.categoryName
        },
        quantity: item.quantity,
        selectedUnit: item.selectedUnit || item.product.unit
      })),
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      discountAmount: order.discountAmount,
      promoCodeUsed: order.promoCodeUsed || null,
      tipAmount: order.tipAmount || 0,
      totalAmount: order.totalAmount,
      status: order.status,
      address: order.address ? {
        id: order.address.id || '',
        title: order.address.title || '',
        city: order.address.city || '',
        area: order.address.area || '',
        street: order.address.street || '',
        building: order.address.building || '',
        details: order.address.details || '',
        isDefault: Boolean(order.address.isDefault),
        phone: order.address.phone || '',
        addressType: order.address.addressType || 'منزل',
        coordinates: order.address.coordinates ? {
          lat: order.address.coordinates.lat,
          lng: order.address.coordinates.lng
        } : null
      } : null,
      paymentMethod: order.paymentMethod,
      deliverySlot: order.deliverySlot,
      orderNotes: order.orderNotes || '',
      driverInfo: order.driverInfo || null,
      earnedPoints: order.earnedPoints || 0,
      userId: order.userId || ''
    };
  }

  static fromFirestore(id: string, data: any): OrderEntity {
    return {
      id,
      orderNumber: data.orderNumber || id.slice(0, 8),
      createdAt: data.createdAt || new Date().toISOString(),
      items: data.items || [],
      subtotal: data.subtotal || 0,
      deliveryFee: data.deliveryFee || 0,
      discountAmount: data.discountAmount || 0,
      promoCodeUsed: data.promoCodeUsed || undefined,
      tipAmount: data.tipAmount || 0,
      totalAmount: data.totalAmount || 0,
      status: data.status || 'received',
      address: data.address || {
        id: 'addr_1',
        title: 'المنزل',
        city: 'صنعاء',
        area: 'حدة',
        street: 'الشارع الرئيسي',
        building: '',
        isDefault: true
      },
      paymentMethod: data.paymentMethod || 'cash',
      deliverySlot: data.deliverySlot || 'توصيل سريع (خلال 35 - 45 دقيقة)',
      orderNotes: data.orderNotes || '',
      driverInfo: data.driverInfo || undefined,
      earnedPoints: data.earnedPoints || 0,
      userId: data.userId || ''
    };
  }
}
