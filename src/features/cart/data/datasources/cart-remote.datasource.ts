import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db, cleanForFirestore } from '../../../../lib/firebase';
import { CartItemEntity } from '../../domain/entities/cart-item.entity';

export class CartRemoteDataSource {
  /**
   * Fetches the user's saved cart from Firestore
   */
  async getCart(userId: string): Promise<CartItemEntity[]> {
    if (!userId) return [];
    try {
      const cartDocRef = doc(db, 'users', userId, 'cart', 'current');
      const snap = await getDoc(cartDocRef);
      if (snap.exists()) {
        const data = snap.data();
        if (Array.isArray(data?.items)) {
          return data.items;
        }
      }
      return [];
    } catch (error) {
      console.warn('Error fetching cart from Firestore:', error);
      return [];
    }
  }

  /**
   * Persists the user's cart in Firestore
   */
  async saveCart(userId: string, items: CartItemEntity[]): Promise<void> {
    if (!userId) return;
    try {
      const cartDocRef = doc(db, 'users', userId, 'cart', 'current');
      const sanitizedItems = cleanForFirestore(items);
      await setDoc(cartDocRef, {
        items: sanitizedItems,
        updatedAt: new Date().toISOString(),
        itemsCount: items.reduce((acc, i) => acc + (i.quantity || 1), 0)
      }, { merge: true });
    } catch (error) {
      console.warn('Error saving cart to Firestore:', error);
    }
  }

  /**
   * Clears the user's cart in Firestore
   */
  async clearCart(userId: string): Promise<void> {
    if (!userId) return;
    try {
      const cartDocRef = doc(db, 'users', userId, 'cart', 'current');
      await setDoc(cartDocRef, {
        items: [],
        updatedAt: new Date().toISOString(),
        itemsCount: 0
      });
    } catch (error) {
      console.warn('Error clearing cart in Firestore:', error);
    }
  }
}
