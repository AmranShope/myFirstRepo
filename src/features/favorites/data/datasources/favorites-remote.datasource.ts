import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../../../lib/firebase';
import { PRODUCTS } from '../../../../data/mockData';
import { Product } from '../../../../types';

export class FavoritesRemoteDataSource {
  private getStorageKey(userId?: string): string {
    return userId && userId !== 'guest' ? `troolly_favs_${userId}` : 'troolly_favs_guest';
  }

  async getFavoriteIds(userId?: string): Promise<string[]> {
    const key = this.getStorageKey(userId);
    let localFavs: string[] = [];
    try {
      const saved = localStorage.getItem(key) || localStorage.getItem('troolly_favs');
      if (saved) {
        localFavs = JSON.parse(saved);
      }
    } catch {
      localFavs = [];
    }

    if (!userId || userId === 'guest') {
      return localFavs;
    }

    try {
      const userDocRef = doc(db, 'users', userId);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data();
        if (Array.isArray(data.favorites)) {
          const merged = Array.from(new Set([...data.favorites, ...localFavs]));
          localStorage.setItem(key, JSON.stringify(merged));
          return merged;
        }
      }
    } catch (e) {
      console.warn('Error reading favorites from Firestore:', e);
    }

    return localFavs;
  }

  async saveFavorites(userId: string | undefined, favoriteIds: string[]): Promise<void> {
    const key = this.getStorageKey(userId);
    try {
      localStorage.setItem(key, JSON.stringify(favoriteIds));
      localStorage.setItem('troolly_favs', JSON.stringify(favoriteIds));
    } catch {
      // ignore
    }

    if (!userId || userId === 'guest') return;

    try {
      const userDocRef = doc(db, 'users', userId);
      await setDoc(userDocRef, { favorites: favoriteIds, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (e) {
      console.warn('Error saving favorites to Firestore:', e);
    }
  }

  getProductsByIds(ids: string[]): Product[] {
    return PRODUCTS.filter(product => ids.includes(product.id));
  }
}
