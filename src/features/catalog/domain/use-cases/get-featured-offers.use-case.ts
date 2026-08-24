import { ICatalogRepository } from '../repositories/catalog.repository';
import { ProductEntity, BundleOfferEntity } from '../entities/product.entity';

export interface FeaturedOffersResult {
  discountedProducts: ProductEntity[];
  bundles: BundleOfferEntity[];
}

export class GetFeaturedOffersUseCase {
  constructor(private catalogRepository: ICatalogRepository) {}

  async execute(): Promise<FeaturedOffersResult> {
    const [discountedProducts, bundles] = await Promise.all([
      this.catalogRepository.getProducts({ onlyOffers: true }),
      this.catalogRepository.getBundleOffers()
    ]);

    return {
      discountedProducts,
      bundles
    };
  }
}
