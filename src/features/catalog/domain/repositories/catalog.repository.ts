import { ProductEntity, BundleOfferEntity } from '../entities/product.entity';
import { CategoryEntity } from '../entities/category.entity';
import { PromoBannerEntity } from '../entities/banner.entity';

export interface CatalogFilterOptions {
  categoryId?: string | null;
  searchQuery?: string;
  subcategory?: string | null;
  onlyOffers?: boolean;
}

export interface ICatalogRepository {
  getProducts(options?: CatalogFilterOptions): Promise<ProductEntity[]>;
  getProductById(id: string): Promise<ProductEntity | null>;
  getCategories(): Promise<CategoryEntity[]>;
  getCategoryById(id: string): Promise<CategoryEntity | null>;
  getPromoBanners(): Promise<PromoBannerEntity[]>;
  getBundleOffers(): Promise<BundleOfferEntity[]>;
}
