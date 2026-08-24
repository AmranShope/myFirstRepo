import { Product } from '../../../../types';

export interface FavoritesRepository {
  getFavoriteIds(userId?: string): Promise<string[]>;
  getFavoriteProducts(userId?: string): Promise<Product[]>;
  toggleFavorite(productId: string, userId?: string): Promise<{ isFavorite: boolean; favorites: string[] }>;
  clearAllFavorites(userId?: string): Promise<void>;
}
