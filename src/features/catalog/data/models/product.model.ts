import { ProductEntity } from '../../domain/entities/product.entity';

export class ProductModel {
  static fromFirestore(id: string, data: any): ProductEntity {
    return {
      id: id || data?.id,
      name: data?.name || '',
      nameEn: data?.nameEn,
      price: typeof data?.price === 'number' ? data.price : 0,
      originalPrice: data?.originalPrice,
      unit: data?.unit || '1 حبة',
      availableUnits: data?.availableUnits || [],
      image: data?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80',
      categoryId: data?.categoryId || '',
      categoryName: data?.categoryName || '',
      subcategory: data?.subcategory,
      badge: data?.badge,
      badgeColor: data?.badgeColor,
      rating: typeof data?.rating === 'number' ? data.rating : 4.8,
      reviewCount: typeof data?.reviewCount === 'number' ? data.reviewCount : 12,
      isFresh: Boolean(data?.isFresh),
      isYemeniLocal: Boolean(data?.isYemeniLocal),
      inStock: data?.inStock !== undefined ? Boolean(data?.inStock) : true,
      description: data?.description || '',
      brand: data?.brand,
      origin: data?.origin,
      tags: data?.tags || []
    };
  }

  static toFirestore(entity: Partial<ProductEntity>): Record<string, any> {
    const data: Record<string, any> = { ...entity };
    delete data.id;
    return data;
  }
}
