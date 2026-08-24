import { ICatalogRepository, CatalogFilterOptions } from '../../domain/repositories/catalog.repository';
import { ProductEntity, BundleOfferEntity } from '../../domain/entities/product.entity';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { PromoBannerEntity } from '../../domain/entities/banner.entity';
import { CatalogRemoteDataSource } from '../datasources/catalog-remote.datasource';

export class CatalogRepositoryImpl implements ICatalogRepository {
  constructor(private remoteDataSource: CatalogRemoteDataSource = new CatalogRemoteDataSource()) {}

  async getProducts(options?: CatalogFilterOptions): Promise<ProductEntity[]> {
    return await this.remoteDataSource.fetchProducts(options);
  }

  async getProductById(id: string): Promise<ProductEntity | null> {
    return await this.remoteDataSource.fetchProductById(id);
  }

  async getCategories(): Promise<CategoryEntity[]> {
    return await this.remoteDataSource.fetchCategories();
  }

  async getCategoryById(id: string): Promise<CategoryEntity | null> {
    return await this.remoteDataSource.fetchCategoryById(id);
  }

  async getPromoBanners(): Promise<PromoBannerEntity[]> {
    return await this.remoteDataSource.fetchPromoBanners();
  }

  async getBundleOffers(): Promise<BundleOfferEntity[]> {
    return await this.remoteDataSource.fetchBundleOffers();
  }

  async seedCatalog(): Promise<{ seededCategories: number; seededProducts: number; seededBanners: number }> {
    return await this.remoteDataSource.seedCatalogToFirestore();
  }
}
