import { ICatalogRepository, CatalogFilterOptions } from '../repositories/catalog.repository';
import { ProductEntity } from '../entities/product.entity';

export class GetProductsUseCase {
  constructor(private catalogRepository: ICatalogRepository) {}

  async execute(options?: CatalogFilterOptions): Promise<ProductEntity[]> {
    return await this.catalogRepository.getProducts(options);
  }
}
