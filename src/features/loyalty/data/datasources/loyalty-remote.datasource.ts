import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { LoyaltyPointHistory, LoyaltyReward } from '../../domain/entities/loyalty.entity';
import { AVAILABLE_LOYALTY_REWARDS } from '../models/loyalty.model';

export class LoyaltyRemoteDataSource {
  async getUserPoints(userId: string): Promise<number> {
    if (!userId || userId === 'guest') return 0;
    try {
      const userRef = doc(db, 'users', userId);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        return typeof data.loyaltyPoints === 'number' ? data.loyaltyPoints : 50;
      }
      return 50;
    } catch (e) {
      console.warn('Error reading user points from firestore:', e);
      return 50;
    }
  }

  async getPointHistory(userId: string): Promise<LoyaltyPointHistory[]> {
    if (!userId || userId === 'guest') return [];
    try {
      const historyCol = collection(db, 'users', userId, 'loyalty_history');
      const q = query(historyCol, orderBy('createdAt', 'desc'), limit(30));
      const snap = await getDocs(q);
      const list: LoyaltyPointHistory[] = [];
      snap.forEach(docSnap => {
        list.push({ id: docSnap.id, ...(docSnap.data() as any) });
      });
      return list;
    } catch (e) {
      console.warn('Error reading loyalty history from firestore:', e);
      return [];
    }
  }

  async addHistoryEntry(userId: string, entry: Omit<LoyaltyPointHistory, 'id'>): Promise<string> {
    if (!userId || userId === 'guest') return '';
    try {
      const id = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const docRef = doc(db, 'users', userId, 'loyalty_history', id);
      await setDoc(docRef, { ...entry, id }, { merge: true });
      return id;
    } catch (e) {
      console.warn('Error adding loyalty history:', e);
      return '';
    }
  }

  async updateUserPoints(userId: string, newPoints: number): Promise<void> {
    if (!userId || userId === 'guest') return;
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        loyaltyPoints: newPoints,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Error updating points:', e);
    }
  }

  getRewards(): LoyaltyReward[] {
    return AVAILABLE_LOYALTY_REWARDS;
  }
}
