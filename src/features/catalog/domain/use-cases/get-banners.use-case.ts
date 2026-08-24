import { ICatalogRepository } from '../repositories/catalog.repository';
import { PromoBannerEntity } from '../entities/banner.entity';

export class GetPromoBannersUseCase {
  constructor(private catalogRepository: ICatalogRepository) {}

  async execute(): Promise<PromoBannerEntity[]> {
    return await this.catalogRepository.getPromoBanners();
  }
}
