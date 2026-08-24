import { useState, useEffect, useCallback, useMemo } from 'react';
import { CatalogRepositoryImpl } from '../../data/repositories/catalog.repository.impl';
import { GetProductsUseCase } from '../../domain/use-cases/get-products.use-case';
import { GetCategoriesUseCase } from '../../domain/use-cases/get-categories.use-case';
import { GetFeaturedOffersUseCase } from '../../domain/use-cases/get-featured-offers.use-case';
import { GetPromoBannersUseCase } from '../../domain/use-cases/get-banners.use-case';
import { ProductEntity, BundleOfferEntity } from '../../domain/entities/product.entity';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { PromoBannerEntity } from '../../domain/entities/banner.entity';
import { CatalogFilterOptions } from '../../domain/repositories/catalog.repository';

const catalogRepository = new CatalogRepositoryImpl();
const getProductsUseCase = new GetProductsUseCase(catalogRepository);
const getCategoriesUseCase = new GetCategoriesUseCase(catalogRepository);
const getFeaturedOffersUseCase = new GetFeaturedOffersUseCase(catalogRepository);
const getPromoBannersUseCase = new GetPromoBannersUseCase(catalogRepository);

export function useCatalog() {
  const [categories, setCategories] = useState<CategoryEntity[]>([]);
  const [banners, setBanners] = useState<PromoBannerEntity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [cats, bans] = await Promise.all([
          getCategoriesUseCase.execute(),
          getPromoBannersUseCase.execute()
        ]);
        if (isMounted) {
          setCategories(cats);
          setBanners(bans);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadInitialData();
    return () => { isMounted = false; };
  }, []);

  const getFilteredProducts = useCallback(async (options?: CatalogFilterOptions): Promise<ProductEntity[]> => {
    return await getProductsUseCase.execute(options);
  }, []);

  const getFeaturedOffers = useCallback(async (): Promise<{ discountedProducts: ProductEntity[]; bundles: BundleOfferEntity[] }> => {
    return await getFeaturedOffersUseCase.execute();
  }, []);

  return {
    categories,
    banners,
    loading,
    getFilteredProducts,
    getFeaturedOffers,
    catalogRepository
  };
}
