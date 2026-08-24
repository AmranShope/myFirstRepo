import { Product } from '../../../../types';

export interface FavoriteItemEntity {
  productId: string;
  addedAt: string;
  product?: Product;
}

export interface FavoritesListEntity {
  userId?: string;
  productIds: string[];
  items: FavoriteItemEntity[];
  totalCount: number;
}
