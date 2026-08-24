import { useMemo, useCallback } from 'react';
import { useApp } from '../../../../context/AppContext';
import { PRODUCTS } from '../../../../data/mockData';
import { Product } from '../../../../types';

export function useFavorites() {
  const { favorites, toggleFavorite, isFavorite, addToCart, showToast } = useApp();

  const favoriteProducts: Product[] = useMemo(() => {
    return PRODUCTS.filter(p => favorites.includes(p.id));
  }, [favorites]);

  const addAllToCart = useCallback(() => {
    if (favoriteProducts.length === 0) {
      showToast('قائمة المفضلة فارغة');
      return;
    }
    favoriteProducts.forEach(product => {
      addToCart(product, 1);
    });
    showToast(`تمت إضافة ${favoriteProducts.length} منتجات من المفضلة إلى السلة 🛒`);
  }, [favoriteProducts, addToCart, showToast]);

  return {
    favoriteIds: favorites,
    favoriteProducts,
    favoriteCount: favorites.length,
    isFavorite,
    toggleFavorite,
    addAllToCart
  };
}
