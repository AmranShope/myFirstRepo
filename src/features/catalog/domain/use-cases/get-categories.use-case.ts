import { ICatalogRepository } from '../repositories/catalog.repository';
import { CategoryEntity } from '../entities/category.entity';

export class GetCategoriesUseCase {
  constructor(private catalogRepository: ICatalogRepository) {}

  async execute(): Promise<CategoryEntity[]> {
    return await this.catalogRepository.getCategories();
  }
}
