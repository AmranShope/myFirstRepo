import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { OrderEntity, CreateOrderParams } from '../../domain/entities/order.entity';
import { OrderModel } from '../models/order.model';

const LOCAL_ORDERS_KEY = 'troolly_orders';

export class OrderRemoteDataSource {
  private getLocalOrders(): OrderEntity[] {
    try {
      const data = localStorage.getItem(LOCAL_ORDERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  private saveLocalOrders(orders: OrderEntity[]): void {
    try {
      localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.warn('Error saving orders locally:', e);
    }
  }

  async getUserOrders(userId: string): Promise<OrderEntity[]> {
    if (!userId) {
      return this.getLocalOrders();
    }

    try {
      const ordersRef = collection(db, 'users', userId, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const orders: OrderEntity[] = [];
      snapshot.forEach((docSnap) => {
        orders.push(OrderModel.fromFirestore(docSnap.id, docSnap.data()));
      });

      this.saveLocalOrders(orders);
      return orders;
    } catch (err) {
      console.warn('Firestore fetch orders failed, using local cache:', err);
      return this.getLocalOrders();
    }
  }

  async getOrderById(userId: string, orderId: string): Promise<OrderEntity | null> {
    if (!userId) {
      const local = this.getLocalOrders();
      return local.find(o => o.id === orderId) || null;
    }

    try {
      const orderRef = doc(db, 'users', userId, 'orders', orderId);
      const snap = await getDoc(orderRef);
      if (snap.exists()) {
        return OrderModel.fromFirestore(snap.id, snap.data());
      }
      return null;
    } catch (err) {
      console.warn('Firestore fetch order by ID failed:', err);
      const local = this.getLocalOrders();
      return local.find(o => o.id === orderId) || null;
    }
  }

  async createOrder(params: CreateOrderParams): Promise<OrderEntity> {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `TRL-${randomSuffix}`;
    const orderId = `order_${Date.now()}_${randomSuffix}`;
    const createdAt = new Date().toISOString();
    const earnedPoints = Math.floor(params.totalAmount / 100); // 1 point per 100 YER

    const newOrder: OrderEntity = {
      id: orderId,
      orderNumber,
      createdAt,
      items: params.items,
      subtotal: params.subtotal,
      deliveryFee: params.deliveryFee,
      discountAmount: params.discountAmount,
      promoCodeUsed: params.promoCodeUsed,
      tipAmount: 0,
      totalAmount: params.totalAmount,
      status: 'received',
      address: params.address,
      paymentMethod: params.paymentMethod,
      deliverySlot: params.deliverySlot,
      orderNotes: params.orderNotes,
      driverInfo: {
        name: 'الكابتن / أحمد اليافعي',
        phone: '771234567',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        vehicle: 'دراجة ترولي الذكية #108',
        rating: 4.9,
        currentLocName: 'شارع حدة - بالقرب من مركز الكميم'
      },
      earnedPoints,
      userId: params.userId
    };

    // Save to Firestore if user is authenticated
    if (params.userId) {
      try {
        const orderRef = doc(db, 'users', params.userId, 'orders', orderId);
        await setDoc(orderRef, OrderModel.toFirestore(newOrder));
      } catch (err) {
        console.error('Failed to write order to Firestore, storing locally:', err);
      }
    }

    // Save in local storage cache
    const currentOrders = this.getLocalOrders();
    this.saveLocalOrders([newOrder, ...currentOrders]);

    return newOrder;
  }

  async cancelOrder(userId: string, orderId: string): Promise<void> {
    if (userId) {
      try {
        const orderRef = doc(db, 'users', userId, 'orders', orderId);
        await updateDoc(orderRef, { status: 'cancelled' });
      } catch (err) {
        console.error('Failed to cancel order in Firestore:', err);
      }
    }

    const currentOrders = this.getLocalOrders();
    const updated = currentOrders.map(o => o.id === orderId ? { ...o, status: 'cancelled' as const } : o);
    this.saveLocalOrders(updated);
  }

  listenToUserOrders(userId: string, callback: (orders: OrderEntity[]) => void): () => void {
    if (!userId) {
      callback(this.getLocalOrders());
      return () => {};
    }

    try {
      const ordersRef = collection(db, 'users', userId, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const orders: OrderEntity[] = [];
        snapshot.forEach((docSnap) => {
          orders.push(OrderModel.fromFirestore(docSnap.id, docSnap.data()));
        });
        this.saveLocalOrders(orders);
        callback(orders);
      }, (err) => {
        console.warn('Orders listener error:', err);
        callback(this.getLocalOrders());
      });

      return unsubscribe;
    } catch (e) {
      console.warn('Failed to attach orders listener:', e);
      callback(this.getLocalOrders());
      return () => {};
    }
  }
}
