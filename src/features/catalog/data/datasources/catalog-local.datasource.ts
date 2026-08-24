import { PRODUCTS, CATEGORIES, BANNERS } from '../../../../data/mockData';
import { ProductEntity, BundleOfferEntity } from '../../domain/entities/product.entity';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { PromoBannerEntity } from '../../domain/entities/banner.entity';
import { CatalogFilterOptions } from '../../domain/repositories/catalog.repository';

export const BUNDLE_OFFERS: BundleOfferEntity[] = [
  {
    id: 'b1',
    title: 'سلة المطبخ اليمني الاقتصادية 🌾',
    desc: 'أرز الشاهين 5كجم + زيت عافية 1.5 لتر + سمن بلدي 500غ + معجون طماطم',
    originalPrice: 30300,
    price: 26800,
    saving: 3500,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80',
    productIds: ['p15', 'p16', 'p17']
  },
  {
    id: 'b2',
    title: 'سلة الفواكه الطازجة الممتازة 🥭',
    desc: 'مانجو سمكة 2كجم + موز يمني 2كجم + تفاح أحمر سكري 1كجم',
    originalPrice: 12200,
    price: 9800,
    saving: 2400,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=500&q=80',
    productIds: ['p1', 'p2', 'p5']
  }
];

export class CatalogLocalDataSource {
  async fetchProducts(options?: CatalogFilterOptions): Promise<ProductEntity[]> {
    let result = [...PRODUCTS] as ProductEntity[];

    if (!options) return result;

    if (options.onlyOffers) {
      result = result.filter(p => p.originalPrice && p.originalPrice > p.price);
    }

    if (options.categoryId) {
      result = result.filter(p => p.categoryId === options.categoryId);
    }

    if (options.subcategory) {
      result = result.filter(p => p.subcategory === options.subcategory);
    }

    if (options.searchQuery && options.searchQuery.trim()) {
      const q = options.searchQuery.toLowerCase().trim();
      result = result.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(q);
        const brandMatch = product.brand?.toLowerCase().includes(q) || false;
        const descMatch = product.description.toLowerCase().includes(q);
        const tagMatch = product.tags?.some(t => t.toLowerCase().includes(q)) || false;
        return nameMatch || brandMatch || descMatch || tagMatch;
      });
    }

    return result;
  }

  async fetchProductById(id: string): Promise<ProductEntity | null> {
    const found = PRODUCTS.find(p => p.id === id);
    return (found as ProductEntity) || null;
  }

  async fetchCategories(): Promise<CategoryEntity[]> {
    return [...CATEGORIES] as CategoryEntity[];
  }

  async fetchCategoryById(id: string): Promise<CategoryEntity | null> {
    const found = CATEGORIES.find(c => c.id === id);
    return (found as CategoryEntity) || null;
  }

  async fetchPromoBanners(): Promise<PromoBannerEntity[]> {
    return [...BANNERS] as PromoBannerEntity[];
  }

  async fetchBundleOffers(): Promise<BundleOfferEntity[]> {
    return [...BUNDLE_OFFERS];
  }
}
