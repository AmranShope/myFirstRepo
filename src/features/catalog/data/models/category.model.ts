import { CategoryEntity } from '../../domain/entities/category.entity';

export class CategoryModel {
  static fromFirestore(id: string, data: any): CategoryEntity {
    return {
      id: id || data?.id,
      name: data?.name || '',
      iconName: data?.iconName || 'Package',
      bgPastel: data?.bgPastel || '#F1F3F6',
      itemCount: typeof data?.itemCount === 'number' ? data.itemCount : 0,
      image: data?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80'
    };
  }

  static toFirestore(entity: Partial<CategoryEntity>): Record<string, any> {
    const data: Record<string, any> = { ...entity };
    delete data.id;
    return data;
  }
}
