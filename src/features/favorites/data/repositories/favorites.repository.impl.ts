import { FavoritesRepository } from '../../domain/repositories/favorites.repository';
import { FavoritesRemoteDataSource } from '../datasources/favorites-remote.datasource';
import { Product } from '../../../../types';

export class FavoritesRepositoryImpl implements FavoritesRepository {
  private dataSource = new FavoritesRemoteDataSource();

  async getFavoriteIds(userId?: string): Promise<string[]> {
    return this.dataSource.getFavoriteIds(userId);
  }

  async getFavoriteProducts(userId?: string): Promise<Product[]> {
    const ids = await this.dataSource.getFavoriteIds(userId);
    return this.dataSource.getProductsByIds(ids);
  }

  async toggleFavorite(productId: string, userId?: string): Promise<{ isFavorite: boolean; favorites: string[] }> {
    const current = await this.dataSource.getFavoriteIds(userId);
    const exists = current.includes(productId);
    const updated = exists ? current.filter(id => id !== productId) : [...current, productId];
    await this.dataSource.saveFavorites(userId, updated);
    return {
      isFavorite: !exists,
      favorites: updated
    };
  }

  async clearAllFavorites(userId?: string): Promise<void> {
    await this.dataSource.saveFavorites(userId, []);
  }
}
