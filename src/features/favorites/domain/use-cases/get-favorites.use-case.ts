import { FavoritesRepository } from '../repositories/favorites.repository';
import { Product } from '../../../../types';

export class GetFavoritesUseCase {
  constructor(private favoritesRepository: FavoritesRepository) {}

  async execute(userId?: string): Promise<Product[]> {
    return this.favoritesRepository.getFavoriteProducts(userId);
  }
}
