import { FavoritesRepository } from '../repositories/favorites.repository';

export class ToggleFavoriteUseCase {
  constructor(private favoritesRepository: FavoritesRepository) {}

  async execute(productId: string, userId?: string) {
    return this.favoritesRepository.toggleFavorite(productId, userId);
  }
}
